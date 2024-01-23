import { ErrorRequestHandler, Express, application } from "express";
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { Strategy as DiscordStrategy } from "passport-discord";
import { VerifyCallback } from "passport-oauth2";
import { Strategy as LocalStrategy } from "passport-local";
import { App as GitHubApp } from "octokit";
import session from "express-session";
import type { RemultServer } from "remult/server/expressBridge.js";
import { remult } from "remult";
import MongoStore from "connect-mongo";

import { AuthMethod, User } from "../global-includes/users.ts";
import { UserRole } from "../global-includes/common.ts";
import { config } from "./config.ts";

// authenticating via Github login
passport.use(
  new GitHubStrategy(
    {
      clientID: config.githubOAuthClientID,
      clientSecret: config.githubOAuthClientSecret,
      callbackURL: config.publicSite + "/login/github/callback",
      scope: ["user:email"],
    },
    /** This function needs to take a GitHub login and either find or create a
     * matching User object from our db. This also automatically updates the
     * role the User should have based on their status within the HacKSU Github
     * org */
    async function (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback
    ) {
      const app = new GitHubApp({
        appId: config.githubOrgAppID,
        privateKey: config.githubOrgPrivateKey,
      });
      const orgOctokit = await app.getInstallationOctokit(
        config.githubOrgAppInstallation
      );
      let roleUserShouldHave = UserRole.Normal;
      let externalRole = "";
      if (profile.username) {
        try {
          const team = await orgOctokit.rest.orgs.getMembershipForUser({
            org: "hacksu",
            username: profile.username,
          });
          if (team.data.state == "active") {
            if (team.data.role == "admin") {
              roleUserShouldHave = UserRole.Admin;
              externalRole = `@${profile.username}, an admin of the HacKSU organization on GitHub`;
            } else {
              // set up a team for khe staff and check membership and assign UserRole.Staff?
            }
          }
        } catch {
          // user is not in the hacksu org
        }
      }
      if (!profile.emails?.length) {
        done(new Error("did not get email from GitHub"));
      } else {
        done(
          null,
          await User.loginFromOAuth(
            AuthMethod.Github,
            profile.id,
            profile.emails[0].value,
            roleUserShouldHave,
            externalRole
          )
        );
      }
    }
  )
);

passport.use(
  new DiscordStrategy(
    {
      clientID: config.discordOAuthClientID,
      clientSecret: config.discordOAuthClientSecret,
      callbackURL: config.publicSite + "/login/discord/callback",
      scope: ["identify", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      if (!profile.email) {
        done(new Error("did not get email from discord"));
      } else {
        // TODO: figure out a discord role situation that makes sense
        const adminIDsOnDiscord = ["402326044872409100", "344132856685002764", "140520164629151744"];
        let userRole = UserRole.Normal;
        let externalRole = "";
        if (adminIDsOnDiscord.includes(profile.id)) {
          userRole = UserRole.Admin;
          externalRole = `@${profile.username}, on the list of important Discord users in server/auth.ts`;
        }
        done(
          null,
          await User.loginFromOAuth(
            AuthMethod.Discord,
            profile.id,
            profile.email,
            userRole,
            externalRole
          )
        );
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false
    },
    async function verify(req, email:string, password:string, done:any) {
      console.log('Running verify function :3');
      //check if email and password fields are populated
      if (!email) { 
        console.log("no email found")
        done("invalid email");
      }
      if (!password) {
        console.log("no password found")
        done("invlaid password");
      }
      //call function to register or login based on the value of req.body.newUser
      if (req.body.newUser) {
        console.log("creating a new user...")
          const accountCreationResult = await User.createLocalAccount(
              email,
              password,
              req.body.confirmPassword
          );
          if (typeof accountCreationResult === "string"){
            done(accountCreationResult, null);
          } else {
            done (null, accountCreationResult);
          }
      } else {
        console.log("logging in as an existing user...")
          const loginResult = await User.localLogin(
              email,
              password
          );
          if (typeof loginResult === "string") {
            done(loginResult, null);
          } else {
            done(null, loginResult);
          }
      }
    }
  )
);
// this function takes a User object returned by an authentication strategy
// after login and saves its id in the data for the newly created active session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// this function takes an id that was saved in the data for an active session
// and turns it into a User object that can be accessed in request data later
passport.deserializeUser(function (
  id: string,
  done: (err: any, user?: User | null) => void
) {
  // this seems cacheable
  const users = remult.repo(User);
  users.findFirst({ id }).then((user) => {
    if (user) {
      done(null, user);
    } else {
      done("user from session not found");
    }
  });
});

export function registerAuthMiddleware(
  app: Express,
  remultConfig: RemultServer
) {
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        domain: ".khe.io", // assuming this site will be served under this domain!
      },
      store: MongoStore.create({ mongoUrl: config.mongoURI }),
    })
  );
  app.use(remultConfig.withRemult, passport.session());
  app.get("/logout", function (req, res) {
    req.session.destroy(() => res.redirect("/"));
  });
  app.get("/login/github", passport.authenticate("github"));
  app.get(
    "/login/github/callback",
    remultConfig.withRemult,
    passport.authenticate("github", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/profile");
    }
  );
  app.get("/login/discord", passport.authenticate("discord"));
  app.get(
    "/login/discord/callback",
    remultConfig.withRemult,
    passport.authenticate("discord", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/profile");
    }
  );
  //login as local user
  app.post('/login/local', function(req, res, next) {
    passport.authenticate('local', function(err: string, user: User) {
      if (err) {
        console.log("error in local login authenticate callback: ", err)
        res.send({success: false, message: err});
      } else {
        req.login(user, loginErr => {
            if (loginErr) {
                console.error("session creation failed!");
                return next(loginErr);
            }
            return res.send({ success: true, user, goToPage: "/profile" });
        });
        }   
    })(req, res, next);
  });
}

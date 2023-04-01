import fs from "fs";
import { Express } from "express";
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { Strategy as DiscordStrategy } from "passport-discord";
import { VerifyCallback } from "passport-oauth2";
import { App as GitHubApp } from "octokit";
import { parse } from "yaml";
import session from "express-session";

import { AuthMethod, User, UserRole } from "../global-includes/users.js";
import { remultConfig } from "../global-includes/exports.js";
import { remult } from "remult";

const secrets = parse(fs.readFileSync("./secrets.yaml", { encoding: "utf-8" }));

// authenticating via Github login
passport.use(
  new GitHubStrategy(
    {
      clientID: secrets.githubOAuthClientID,
      clientSecret: secrets.githubOAuthClientSecret,
      callbackURL: "http://127.0.0.1:3000/login/github/callback",
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
        appId: 262520, // https://github.com/apps/hacksu-read
        privateKey: secrets.githubOrgPrivateKey,
      });
      // https://github.com/organizations/hacksu/settings/installations/33272343
      const orgOctokit = await app.getInstallationOctokit(33272343);
      let roleUserShouldHave = UserRole.Normal;
      let externalRole = "";
      if (profile.username) {
        const team = await orgOctokit.rest.orgs.getMembershipForUser({
          org: "hacksu",
          username: profile.username,
        });
        if (team.data.state == "active") {
          if (team.data.role == "admin") {
            roleUserShouldHave = UserRole.Admin;
            externalRole = `@${profile.username}, admin of HacKSU organization on GitHub`;
          } else {
            // set up a team for khe staff and check membership and assign UserRole.Staff?
          }
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
      clientID: secrets.discordOAuthClientID,
      clientSecret: secrets.discordOAuthClientSecret,
      callbackURL: "http://127.0.0.1:3000/login/discord/callback",
      scope: ["identify", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      if (!profile.email) {
        done(new Error("did not get email from discord"));
      } else {
        // TODO: figure out a discord role situation that makes sense
        const adminIDsOnDiscord = ["402326044872409100", "344132856685002764"];
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

// this function takes a User object returned by an authentication strategy
// after login and saves its id in the data for the newly created active session
passport.serializeUser(function (user, done) {
  done(null, (user as User).id);
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
    done(null, user);
  });
});

export function registerAuthMiddleware(app: Express) {
  app.use(
    session({
      secret: secrets.sessionSecret,
      resave: false,
      saveUninitialized: false,
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
}

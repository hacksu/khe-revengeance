import fs from "fs";
import { Express } from "express";
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GithubProfile,
} from "passport-github2";
import { VerifyCallback } from "passport-oauth2";
import { App as GitHubApp } from "octokit";
import { parse } from "yaml";
import session from "express-session";

import { AuthMethod, User, UserRole } from "../global-includes/users.js";
import { remultConfig } from "../global-includes/exports.js";
import { remult } from "remult";

const secrets = parse(fs.readFileSync("./secrets.yaml", { encoding: "utf-8" }));

// authenticating via GithubLogin
passport.use(
  new GitHubStrategy(
    {
      clientID: secrets.githubOAuthClientID,
      clientSecret: secrets.githubOAuthClientSecret,
      callbackURL: "http://localhost:3000/login/github/callback",
    },
    /** This function needs to take a GitHub login and either find or create a
     * matching User object from our db. This also automatically updates the
     * role the User should have based on their status within the HacKSU Github
     * org */
    async function (
      accessToken: string,
      refreshToken: string,
      profile: GithubProfile,
      done: VerifyCallback
    ) {
      console.log("authenticating with github strategy");
      const app = new GitHubApp({
        appId: 262520, // https://github.com/apps/hacksu-read
        privateKey: secrets.githubOrgPrivateKey,
      });
      // https://github.com/organizations/hacksu/settings/installations/33272343
      const orgOctokit = await app.getInstallationOctokit(33272343);
      let roleUserShouldHave = UserRole.Normal;
      let roleReason = "";
      if (profile.username) {
        const team = await orgOctokit.rest.orgs.getMembershipForUser({
          org: "hacksu",
          username: profile.username,
        });
        if (team.data.state == "active") {
          if (team.data.role == "admin") {
            roleUserShouldHave = UserRole.Admin;
            roleReason = `admin of HacKSU organization on GitHub`;
          } else {
            // set up a team for khe staff and check membership and assign UserRole.Staff?
          }
        }
      }
      console.log("github authentication successful");
      done(
        null,
        await User.loginFromOAuth(
          AuthMethod.Github,
          profile.id,
          roleUserShouldHave,
          roleReason
        )
      );
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
  app.get(
    "/login/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );
  app.get(
    "/login/github/callback",
    remultConfig.withRemult,
    passport.authenticate("github", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/profile");
    }
  );
}

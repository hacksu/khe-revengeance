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

const secrets = parse(fs.readFileSync("./secrets.yaml", { encoding: "utf-8" }));

passport.use(
  new GitHubStrategy(
    {
      clientID: secrets.githubOAuthClientID,
      clientSecret: secrets.githubOAuthClientSecret,
      callbackURL: "http://localhost:3000/login/github/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: GithubProfile,
      done: VerifyCallback
    ) {
      console.log(profile);

      const app = new GitHubApp({
        appId: 262520, // https://github.com/apps/hacksu-read
        privateKey: secrets.githubOrgPrivateKey,
      });
      // https://github.com/organizations/hacksu/settings/installations/33272343
      const orgOctokit = await app.getInstallationOctokit(33272343);
      let roleUserShouldHave = UserRole.Normal;
      if (profile.username) {
        const team = await orgOctokit.rest.teams.getMembershipForUserInOrg({
          org: "hacksu",
          team_slug: "ssh",
          username: profile.username!,
        });
        if (team.data.state == "active") {
          console.log("user in ssh team");
          roleUserShouldHave = UserRole.Admin;
        }
      }

      done(
        null,
        await User.loginFromOAuth(
          AuthMethod.Github,
          profile.id,
          roleUserShouldHave
        )
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj as User);
});

export function registerAuthMiddleware(app: Express) {
  app.use(passport.initialize());
  app.use(
    session({
      secret: secrets.sessionSecret,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.session());
  app.get(
    "/login/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );
  app.get(
    "/login/github/callback",
    remultConfig.withRemult,
    passport.authenticate("github", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/");
    }
  );
}

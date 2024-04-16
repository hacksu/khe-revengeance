import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "yaml";

// find the directory at the root of the repository; it is the parent of the
// parent of this file
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

export interface ServerConfig {
  publicSite: string;
  staffSite: string;
  githubOAuthClientID: string;
  githubOAuthClientSecret: string;
  supportEmailRecipient: string;
  sessionSecret: string;
  sendgridKey: string;
  discordOAuthClientID: string;
  discordOAuthClientSecret: string;
  githubOrgAppID: number;
  githubOrgAppInstallation: number;
  githubOrgPrivateKey: string;
  mongoURI: string;
  port: number;
  incomingEmailHost: string;
  outgoingEmailWhitelist?: string[];
}

const secrets = parse(
  fs.readFileSync(path.resolve(projectRoot, "secrets.yaml"), {
    encoding: "utf-8",
  })
);
// TODO: check type?
const config: ServerConfig = {
  ...secrets.configIndependent,
  ...secrets.configs[secrets.currentConfig],
};

export { config, projectRoot };

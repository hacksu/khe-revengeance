import fs from "fs";
import { parse } from "yaml";

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
}

const secrets = parse(fs.readFileSync("./secrets.yaml", { encoding: "utf-8" }));
// TODO: check type?
const config: ServerConfig = {
  ...secrets.configIndependent,
  ...secrets.configs[secrets.currentConfig],
};
export { config };

import { BackendMethod, Entity, Fields, EntityBase, remult } from "remult";
import { rawObj } from "./adaptations.js";

export enum AuthMethod {
  Discord = "Discord",
  Github = "Github",
  Local = "Local",
}

export enum UserRole {
  Normal = "normal",
  Staff = "staff",
  Admin = "admin",
}

export interface HackathonRegistration {
  submitted: boolean;
}

@Entity("users", { allowApiCrud: false, allowApiRead: UserRole.Admin })
export class User extends EntityBase {
  @Fields.uuid()
  id!: string;

  @Fields.createdAt()
  createdAt = new Date();

  @Fields.string()
  method!: AuthMethod;

  /** User's ID in Github or Discord */
  @Fields.string()
  externalID?: string;

  @Fields.string()
  email!: string;

  // we only really need one role but having roles[] complies with remult's
  // UserInfo interface for quick allowApiX checks
  @rawObj()
  roles: UserRole[] = [UserRole.Normal];

  @Fields.string()
  externalRole = "";

  @rawObj()
  registration: HackathonRegistration = { submitted: false };

  /** Called on backend when OAuth succeeds; a session is then created using the
   * returned User object */
  @BackendMethod({ allowed: false })
  static async loginFromOAuth(
    authProvider: AuthMethod,
    externalID: string,
    email: string,
    shouldHaveRole: UserRole,
    externalRole: string = ""
  ) {
    const users = remult.repo(User);
    let user: Partial<User> = await users.findFirst({
      externalID,
      method: authProvider,
    });
    let userUpdated = false;
    if (!user) {
      user = {
        externalID,
        method: authProvider,
        roles: [shouldHaveRole],
        email,
      };
      userUpdated = true;
    }
    if (
      !user.roles ||
      user.roles[0] != shouldHaveRole ||
      user.externalRole != externalRole
    ) {
      user.roles = [shouldHaveRole];
      user.externalRole = externalRole;
      userUpdated = true;
    }
    if (userUpdated) {
      user = await users.save(user);
    }
    return user as User;
  }

  @BackendMethod({ allowed: true })
  static async getOwnUserInfo() {
    // does this have to be its own function???
    return remult.user;
  }
}

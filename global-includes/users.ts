import { BackendMethod, Entity, Fields, EntityBase, remult } from "remult";

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

@Entity("users", { allowApiCrud: false, allowApiRead: UserRole.Admin })
export class User extends EntityBase {
  @Fields.uuid()
  id!: string;

  @Fields.createdAt()
  createdAt = new Date();

  @Fields.object()
  method!: AuthMethod;

  /** User's ID in Github or Discord */
  @Fields.string()
  externalID?: string;

  // we only really need one role but having roles[] complies with remult's
  // UserInfo interface for quick allowApiX checks
  @Fields.object()
  roles: UserRole[] = [UserRole.Normal];

  @Fields.string()
  roleReason = "";

  /** Called on backend when login succeeds; token is then sent to client */
  @BackendMethod({ allowed: false })
  static async loginFromOAuth(
    authProvider: AuthMethod,
    externalID: string,
    shouldHaveRole: UserRole,
    roleReason: string = ""
  ) {
    const users = remult.repo(User);
    let user = await users.findFirst({
      externalID,
      method: authProvider,
    });
    if (!user) {
      const newUser: Partial<User> = {
        externalID,
        method: authProvider,
        roles: [shouldHaveRole],
      };
      user = await users.save(newUser);
    } else if (
      user.roles[0] != shouldHaveRole ||
      user.roleReason != roleReason
    ) {
      user.roles = [shouldHaveRole];
      user.roleReason = roleReason;
      user = await users.save(user);
    }
    return user;
  }

  @BackendMethod({ allowed: true })
  static async getOwnUserInfo() {
    // does this have to be its own function???
    return remult.user;
  }
}

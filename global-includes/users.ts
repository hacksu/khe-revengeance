import { BackendMethod, Entity, Fields, EntityBase, remult } from "remult";
import { RemoteProcedures } from "./rpc-declarations.js";

export enum AuthMethod {
  Discord,
  Github,
  Local,
}

export enum UserRole {
  Normal = "normal",
  Staff = "staff",
  Admin = "admin",
}

export interface LoginSession {
  token: string;
  createdOn: number;
}

@Entity("users", { allowApiCrud: false })
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

  @Fields.object()
  role = UserRole.Normal;

  /** Called on backend when login succeeds; token is then sent to client */
  @BackendMethod({ allowed: false })
  static async loginFromOAuth(
    authProvider: AuthMethod,
    externalID: string,
    shouldHaveRole: UserRole
  ) {
    const users = remult.repo(User);
    let user: Partial<User> = await users.findFirst({
      externalID,
      method: authProvider,
    });
    if (!user) {
      user = {
        externalID,
        method: authProvider,
        role: shouldHaveRole,
      };
      user = await users.save(user);
    } else if (user.role != shouldHaveRole) {
      user.role = shouldHaveRole;
      user = await users.save(user);
    }
    return await users.save(user);
  }
}

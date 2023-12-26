import { BackendMethod, Entity, Fields, EntityBase, remult } from "remult";
import { VFields } from "./adaptations.ts";
import { UserRole } from "./common.ts";
import { z } from "zod";
import { isEmailRegex } from "./email-address.ts";

export enum AuthMethod {
  Discord = "Discord",
  Github = "Github",
  Local = "Local",
}

const AuthMethodEnum = z.nativeEnum(AuthMethod);

export const schoolStatus = [
  "High School",
  "Freshman",
  "Sophmore",
  "Junior",
  "Senior",
  "Graduate Student",
  "Alumni",
] as const;

export const genders = [
  "Male",
  "Female",
  "nonbinary",
  "Other",
  "Prefer not to answer"
] as const;

export const userPronouns = [
  "He/Him",
  "She/Her",
  "He/They",
  "She/They",
  "They/Them",
  "Other",
  "Prefer not to answer"
] as const;

export const ethnicities = [
  "Indian",
  "Black or African",
  "Chinese",
  "Filipino",
  "Guamanian or Chamorro",
  "Hispanic / Latino / Spanish Origin",
  "Japanese",
  "Korean",
  "Middle Eastern",
  "Native American or Alaskan Native",
  "Native Hawaiian",
  "Samoan",
  "Vietnamese",
  "White",
  "Asian",
  "Other Pacific Islander",
  "European",
  "Prefer not to answer", 
  "Other"
] as const;

export const shirtSize = [
  "S", 
  "M",
  "L",
  "XL"
] as const;

// export const dietaryRestrictions = [
//   "Vegetarian",
//   "Vegan",
//   "Halal",
//   "Celiac Disease", 
//   "Peanut Allergy",
//   "Other nut allergy",
//   "Wheat",
//   "Soy",
//   "Lactose Intolerant",
//   "Other"
// ] as const;

export const HackathonRegistrationDraft = z.object({
  name: z.string(),
  school: z.string(),
  phone: z.string(),
  schoolStatus: z.enum(schoolStatus).nullable(),
  firstHackathon: z.boolean().nullable(),
  age: z.number().gte(13).lte(130).nullable(),
  gender: z.enum(genders).nullable(),
  optionalExtraGender: z.string(),
  major: z.string(),
  conduct: z.boolean().nullable(),
  link: z.string(),
  attendedKhe: z.boolean().nullable(),
  pronouns: z.enum(userPronouns).nullable(),
  optionalExtraPronouns: z.string(),
  ethnicity: z.enum(ethnicities).nullable(),
  optionalExtraEthnicity: z.string(),
  sexuality: z.array(z.string()),
  optionalExtraSexuality: z.string(),
  shirtSize: z.enum(shirtSize).nullable(),
  country: z.string(),
  state: z.string(),
  mlhConduct: z.boolean().nullable(),
  mlhShare: z.boolean().nullable(),
  dietaryRestrictions: z.array(z.string()),   
  optionalExtraRestriction: z.string()
});

export type RegistrationDraft = z.infer<typeof HackathonRegistrationDraft>;

const defaultRegistration: RegistrationDraft = {
  name: '',
  school: "",
  phone: "",
  schoolStatus: null,
  firstHackathon: null,
  age: null,
  gender: null,
  optionalExtraGender: "",
  major: "",
  conduct: false,
  link: "",
  attendedKhe: false,
  pronouns: null,
  optionalExtraPronouns: "",
  ethnicity: null,
  optionalExtraEthnicity: "",
  sexuality: [],
  optionalExtraSexuality: "",
  shirtSize: null,
  country: "",
  state: "",
  mlhConduct: false,
  mlhShare: false,
  dietaryRestrictions: [],
  optionalExtraRestriction: ""
};

export const FullRegistration = HackathonRegistrationDraft.extend({
  name: z.string().nonempty(),
  school: z.string().nonempty(),
  phone: z.string().nonempty(),
  major: z.string().nonempty(),
  link: z.string().url(),
  schoolStatus: z.enum(schoolStatus),
  firstHackathon: z.boolean(),
  age: z.number().gte(13).lte(130),
});

export type Registration = z.infer<typeof FullRegistration>;

// name: ""; // full name                                      !
// school: "", // name of school                               !
// phone: "", // phone number                                  !
// shirt: "", // t-shirt size                                  !
// demographic: null, // allowed to use demographic info?       ?
// first: null, // is this your first hackathon?               !
// dietary: [], // food restrictions seperated by |            !
// Vegan, vegitarian, kosher, gluten free, allergy, other
// year: "", // the year in school                             !
// age: "", // person's age                                    !
// gender: "", // gender                                       !
// major: "", // degree                                        !
// conduct: null, // agree to MLH code of conduct?              ?
// travel: null, // need travel reimbursement?                 !
// waiver: false, // agreed to waiver?                           ?
// resume: "", // the filename of their resume                   ?
// link: "", // a github/linkedin link                           ?
// extra: "",
// mlh_emails: null,

const noUpdate = { allowApiUpdate: false };

@Entity<User>("users", {
  allowApiCrud: UserRole.Admin,
  apiPrefilter: () => (remult.isAllowed() ? {} : { id: remult.user?.id }),
})
export class User extends EntityBase {
  @Fields.uuid()
  id!: string;

  @Fields.createdAt()
  createdAt = new Date();

  @VFields.string({
    validate(entity, fieldRef) {
      AuthMethodEnum.parse(fieldRef.value);
    },
    ...noUpdate,
  })
  method!: AuthMethod;

  @VFields.string({
    validate(entity, fieldRef) {
      if (!isEmailRegex.test(fieldRef.value)) {
        throw "user email invalid: " + fieldRef.value;
      }
    },
    ...noUpdate,
  })
  email!: string;

  // we only really need one role but having roles[] complies with remult's
  // UserInfo interface for quick allowApiX checks
  @Fields.json({
    validate(entity, fieldRef) {
      z.nativeEnum(UserRole).array().parse(fieldRef.value);
    },
    allowApiUpdate: [UserRole.Admin],
  })
  roles: UserRole[] = [UserRole.Normal];

  /** User's ID in Github or Discord */
  @VFields.string(noUpdate)
  externalID: string = "";

  @VFields.string(noUpdate)
  externalRole = "";

  @VFields.boolean()
  receivingEmails = true;

  @Fields.json({
    validate(entity, fieldRef) {
      HackathonRegistrationDraft.parse(fieldRef.value);
    },
  })
  registration = defaultRegistration;

  @VFields.string(noUpdate)
  attachedResume: string = "";

  @VFields.boolean(noUpdate)
  submittedApplication = false;

  @VFields.boolean({ allowApiUpdate: [UserRole.Admin] })
  applicationApproved = false;

  @VFields.boolean({ allowApiUpdate: [UserRole.Admin, UserRole.Staff] })
  checkedIn = false;

  /** Called on backend when OAuth succeeds; finds or creates a User object in
   * the database and returns it. A session is then created using the returned
   * User object*/
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
        ...new User(),
        externalID,
        method: authProvider,
        roles: [shouldHaveRole],
        email,
      };
      userUpdated = true;
    }
    // TODO: don't update existing users' roles on normal logins. if anything,
    // update their email
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
  static async submitRegistration() {
    const user = remult.user as User;
    if (!user) {
      throw "Not logged in";
    }
    FullRegistration.parse(user.registration);
    user.submittedApplication = true;
    user.applicationApproved = false;
    remult.repo(User).save(user);
  }

  @BackendMethod({ allowed: true })
  static async getOwnUserInfo() {
    // does this have to be its own function???
    return remult.user;
  }
}

import { BackendMethod, Entity, Fields, EntityBase, remult } from "remult";
import { VFields } from "./adaptations.ts";
import { UserRole } from "./common.ts";
import { z } from "zod";
import { isEmailRegex } from "./email-address.ts";
import crypto from "crypto";

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

export const sexualities = [
  "Heterosexual or Straight",
  "Gay or Lesbian",
  "Bisexual",
  "Prefer not to Answer",
  "Other"
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
  email: z.string(),
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
  sexuality: z.string(),
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
  email: "",
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
  sexuality: "",
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
  allowApiCrud: true,
  apiPrefilter: () => {console.log("REMULT API PREFILTER: ", remult.user); return (remult.isAllowed() ? {} : { id: remult.user?.id });},
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

  @VFields.string()
  password: string = "";

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

  //called when the user fills out the form with intent to create accound
  //returns an error message if something goes wrong
  //returns a User object to create a session for the newly created account
  //under ideal circumstances
  @BackendMethod({ allowed: false })
  static async createLocalAccount(
    email: string, 
    password: string, 
    confirmPassword: string
  ) {
    console.log("creating local account...")
    console.log("email: ", email)
    console.log("password: ", password)
    console.log("confirmPassword: ", confirmPassword)
    const users = remult.repo(User);
    //check if account already exists
    let user: Partial<User> = await users.findFirst({email});
    if (!user) { // user doesn't exist
      console.log("user doesn't already exist!");
      //check if passwords match
      if (password != confirmPassword) { console.log("passwords don't match!"); return "Passwords do not match! "; }
      //hash password
      var hashedPass = crypto.createHash("sha256").update(password).digest("hex");
      console.log("hashed password: ", hashedPass);
      //create remult object with the user's information and return user object
      user = {
        ...new User(),
        email, 
        password: hashedPass,
        method: AuthMethod.Local,
        roles: [UserRole.Normal],
      }
    } else { // user exists
      console.log("user already exists");
      return "User account already exists with this email! Try logging in, or using another authentication method";
    }
    console.log("saving user...")
    user = await users.save(user);
    return user as User;
  }

  //called when the user fills out the form with the intent to login
  //works very similarly to the createLocalAccount function above
  @BackendMethod({ allowed: false })
  static async localLogin(
    email: string, 
    password: string
  ) {
    const users = remult.repo(User);
    //attempt to find a user with the provided email
    let user: Partial<User> = await users.findFirst({email});
    //if the user exists, verify the password
    if (user) {
      let hashedInput = crypto.createHash("sha256").update(password).digest("hex");
      if (hashedInput != user.password) {return "Incorrect Password!"}
    } else {
      return "No account exists with this email!";
    }
    //return the user object
    console.log("returning user: ", user);
    return user as User;
  }

  @BackendMethod({ allowed: true })
  static async submitRegistration() {
    const user = remult.user as User;
    console.log("received user: ", user)
    console.log("received User: ", User)
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

  //takes user credentials as input
  //return true -> password matches record with email
  //return false -> password does not match record with email
  // @BackendMethod({ allowed: true })
  // static async verifyUserPassword(user:User, password:string) {
  //   //hash the provided plaintext password
  //   var hashedInput = crypto.createHash("sha256").update(password).digest("hex")
  //   //check the hashed value against the value stored in the database
  //   if (hashedInput == user.password) { return true; }
  //   else { return false; }
  // }
}

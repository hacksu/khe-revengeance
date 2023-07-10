import {Entity, Fields, Validators} from "remult";
import { UserRole } from "./common.ts";

@Entity<Redirect>(
    "redirects",
    {allowApiCrud: [UserRole.Admin, UserRole.Staff] }
)
export class Redirect {
    @Fields.cuid()
    id="";

    @Fields.string({validate: [Validators.required, Validators.uniqueOnBackend]})
    href="";

    @Fields.string({validate: Validators.required})
    destURL="";
}

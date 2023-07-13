import {Entity, Fields, Validators} from "remult";
import { VFields } from "./adaptations.ts";
import { UserRole } from "./common.ts";

@Entity<Redirect>(
    "redirects",
    {allowApiCrud: [UserRole.Admin, UserRole.Staff] }
)
export class Redirect {
    @Fields.cuid()
    id="";

    @VFields.string({validate: [Validators.uniqueOnBackend]})
    href="";

    @VFields.string()
    destURL="";
}

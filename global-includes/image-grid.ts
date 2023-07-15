import { BackendMethod, Entity, Fields, Validators, dbNamesOf } from "remult";
import { UserRole } from "./common.ts";
import { VFields } from "./adaptations.ts";
import { RemoteProcedures } from "./rpc-declarations.ts";

@Entity("grid-image",
    {allowApiCrud: [UserRole.Staff, UserRole.Admin], allowApiRead: true})
export class GridImage {
    @Fields.cuid()
    id="";

    @VFields.string()
    filename="";

    @VFields.string()
    description="";

    @VFields.string()
    linksTo="";

    @VFields.string()
    note="";

    @VFields.string({validate: Validators.uniqueOnBackend})
    gridName="";

    @VFields.int()
    row=0;

    @VFields.int()
    col=0;

    @VFields.number()
    height=0;

    @VFields.number()
    width=0;

    @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
    static async getGrids() {
      const coll = (await dbNamesOf(GridImage)).$entityName;
      return await RemoteProcedures.getDistinct(coll, "gridName");
    }
}

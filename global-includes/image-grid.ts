import { BackendMethod, Entity, Fields, dbNamesOf } from "remult";
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

    @VFields.string()
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

    @BackendMethod({allowed: [UserRole.Admin, UserRole.Staff]})
    static async clearGrid(name: string){
      const imageColl = (await dbNamesOf(GridImage)).$entityName;
      const rowColl = (await dbNamesOf(GridRow)).$entityName;
      await Promise.all([
        RemoteProcedures.bulkDelete(imageColl, {gridName: name}),
        RemoteProcedures.bulkDelete(rowColl, {gridName: name})
      ]);
    }
}

@Entity("grid-row", {allowApiCrud: [UserRole.Staff, UserRole.Admin], allowApiRead: true})
export class GridRow{
  @Fields.cuid()
  id="";

  @VFields.string()
  gridName="";

  @VFields.string()
  justifyContent="";
  
  @VFields.string()
  alignItems="";

  @VFields.number()
  gap=0;
}

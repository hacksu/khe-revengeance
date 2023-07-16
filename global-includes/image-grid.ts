import { BackendMethod, Entity, Fields, dbNamesOf, remult } from "remult";
import { UserRole } from "./common.ts";
import { VFields } from "./adaptations.ts";
import { RemoteProcedures } from "./rpc-declarations.ts";

export const accessImagePath = "/grid-images/";

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

    static async clearGrid(name: string){
      const imageColl = (await dbNamesOf(GridImage)).$entityName;
      const rowColl = (await dbNamesOf(GridRow)).$entityName;
      await Promise.all([
        RemoteProcedures.bulkDelete(imageColl, {gridName: name}),
        RemoteProcedures.bulkDelete(rowColl, {gridName: name})
      ]);
    }

    @BackendMethod({allowed: [UserRole.Admin, UserRole.Staff]})
    static async setGrid(gridName: string, images: GridImage[], rows?: GridRow[]){
      // diff image filenames; delete missing ones
      const repo = remult.repo(GridImage);
      const grid = await repo.find({where:{gridName}});
      const newFiles = new Set(images.map(i=>i.filename));
      const unusedFiles = grid.filter(i=>!newFiles.has(i.filename));
      await Promise.all(
        [RemoteProcedures.deleteGridImages(unusedFiles.map(f=>f.filename)),
          GridImage.clearGrid(gridName)]
      );
      await Promise.all(images.map(i=>repo.insert(i)));
      if (rows){
        await Promise.all(rows.map(r=>remult.repo(GridRow).insert(r)));
      }
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

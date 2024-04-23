import { BackendMethod, Entity, Fields, remult } from "remult";
import { UserRole } from "./common";

export const galleryURLPath = "/gallery/";

type Image = {
    filename: string;
    hash: string;
};

@Entity("gallery", {allowApiCrud: [UserRole.Admin, UserRole.Staff], allowApiRead: true})
export class Gallery {
    @Fields.string()
    id!: string;

    @Fields.json()
    images: Image[] = [];

    @BackendMethod({allowed: [UserRole.Admin, UserRole.Staff]})
    static async upsert(id: string, images: Image[]) {
        const repo = remult.repo(Gallery);
        const existing = await repo.findId(id);
        if (existing) {
            await repo.save({id, images});
        } else {
            await repo.insert({id, images});
        }
    }
}

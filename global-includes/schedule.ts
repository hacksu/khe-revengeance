import { Entity, Fields, Relations } from "remult";
import { VFields } from "./adaptations.ts";
import { UserRole } from "./common.ts";

@Entity<Schedule>(
    "schedule",
    {
        allowApiCrud: [UserRole.Admin, UserRole.Staff]
    }
)
export class Schedule {
    @Fields.cuid()
    id = "";

    @VFields.string()
    name = "";

    @VFields.number({ defaultValue: () => new Date().getFullYear() })
    year?: number;

    @Fields.json<ScheduleItem[]>()
    items: ScheduleItem[] = [];

}

class ScheduleItem {

}
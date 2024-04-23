import { BackendMethod, Entity, Fields, Relations, remult } from "remult";
import { VFields } from "./adaptations.ts";
import { UserRole } from "./common.ts";

@Entity<Schedule>(
    "schedule",
    {
        allowApiCrud: [UserRole.Admin, UserRole.Staff],
    }
)
export class Schedule {

    @Fields.boolean()
    selected = false

    @Fields.cuid()
    id = "";

    @VFields.string()
    name = "";

    @VFields.number({ defaultValue: () => new Date().getFullYear() })
    year?: number;

    @Fields.json<ScheduleItem[]>()
    items: ScheduleItem[] = [];

    @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
    static async selectSchedule(id: string) {
        const repo = remult.repo(Schedule);
        const schedules = await repo.find({ where: { selected: true }});
        await Promise.all(
            schedules.map(
                schedule => repo.update(schedule.id, { selected: false })
            )
        );
        await repo.update(id, { selected: true });
    }

    @BackendMethod({ allowed: true })
    static async getSelectedSchedule() {
        return await remult.repo(Schedule).findFirst({ selected: true });
    }

}

class ScheduleItem {

    key = 0;
    name = "";
    description = "";
    date = "";

}
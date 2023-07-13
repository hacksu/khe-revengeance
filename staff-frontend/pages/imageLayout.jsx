import { useEffect, useState } from "react";
import KHEStaffLayout from "../layouts/layout";
import { remult } from "remult";
import { GridImage } from "../../global-includes/image-grid";

export default function LayoutImages() {
    const [grids, setGrids] = useState([]);
    const [openGrid, setOpenGrid] = useState("");
    useEffect(() => {
        GridImage.getGrids().then(setGrids);
    }, []);
    const menuNavigation = (click) => {
        // set open grid
    };
    return <KHEStaffLayout>
        <Sider width={200} theme="light">
            <Menu title="Image Layouts" mode="inline" onClick={menuNavigation}
                items={grids.map(g => ({ key: g, label: g }))}
                selectedKeys={[openGrid || grids[0]]} />
        </Sider>
    </KHEStaffLayout>
}
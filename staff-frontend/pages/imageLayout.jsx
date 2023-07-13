import { useEffect, useMemo, useState } from "react";
import { remult } from "remult";
import { Layout, Upload } from "antd";
const { Sider } = Layout;
const { Dragger } = Upload;

import KHEStaffLayout from "../layouts/layout";
import { GridImage } from "../../global-includes/image-grid";
import EditableMenu from "../components/editableMenuItems";
import { PlusCircleOutlined } from "@ant-design/icons";

import style from "./imageLayout.module.css";

function ImageRow({ images, justifyContent, height, addBlobURL }) {
    const props = {
        name: 'file',
        multiple: true,
        accept: "image/jpeg,image/png,.png,.jpg",
        beforeUpload: (file) => {
            const isImage = file.type === 'image/png' || file.type === "image/jpeg";
            if (!isImage) {
                alert(`${file.name} is not a png or jpg file :(`);
            } else {
                addBlobURL(URL.createObjectURL(file));
            }
            console.log(file);
            return false;
        },
        showUploadList: false,
    };
    return <div style={{
        height,
        display: "flex",
        justifyContent: justifyContent || "space-evenly",
        alignItems: "center",
        width: 600,
        height: 100,
        borderTop: "1px solid black",
        borderBottom: "1px solid black"
    }}>
        {
            <Dragger {...props} className={style.emptyRowDragArea}>
                {images?.length ?
                    images.map(i => (
                        <img src={i.tempURL || i.filename} key={i.tempURL || i.id}
                            className={style.imageInRow} />
                    )) :
                    <PlusCircleOutlined />}
            </Dragger>
        }
    </div>;
}

export default function LayoutImages() {
    const [grids, setGrids] = useState([]);
    const [openGrid, setOpenGrid] = useState("");
    const [images, setImages] = useState([]);
    const repo = remult.repo(GridImage);
    useEffect(() => {
        GridImage.getGrids().then(setGrids);
    }, []);
    useEffect(() => {
        repo
            .find({ where: { gridName: openGrid } })
            .then(setImages);
    }, [openGrid]);
    const sortedImages = useMemo(() => {
        const sorted = images.sort(
            (a, b) => a.row == b.row ? a.col - b.col : a.row - b.row);
        const rows = [[]];
        for (let i = 0; i < sorted.length; ++i) {
            if (i != 0 && sorted[i - 1].row != sorted[i].row) {
                rows.push([]);
            }
            rows[rows.length - 1].push(sorted[i]);
        }
        return rows;
    }, [images])
    const menuNavigation = (click) => {
        setOpenGrid(click.key);
    };
    const addImage = (row, url) => {
        let col;
        if (row < sortedImages.length) {
            col = sortedImages[row].length;
        } else {
            col = 0;
        }
        setImages(i => i.concat(
            [{ ...new GridImage(), gridName: openGrid, row, col, tempURL: url }]
        ));
    }
    return <KHEStaffLayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={300} theme="light">
                <EditableMenu title="Image Layouts" mode="inline" onClick={menuNavigation}
                    labels={grids} selectedKeys={[openGrid || grids[0]]}
                    onAdd={(name) => { setGrids(g => g.concat(name)); setOpenGrid(name) }}
                    onEdit={(index, newGridName) => {
                        setGrids(g => g.slice(0, index)
                            .concat([newGridName])
                            .concat(g.slice(index + 1)));
                        // TODO: bulk rename
                    }}
                />
            </Sider>
            {(grids.length || true) ? <div>
                {sortedImages.map((row, i) =>
                    <ImageRow key={i} images={row} addBlobURL={(url) => addImage(i, url)} />
                )}
                {/* <ImageRow images={[]} addBlobURL={(url) => addImage(sortedImages.length, url)} /> */}
            </div> : null}
        </Layout>
    </KHEStaffLayout>
}
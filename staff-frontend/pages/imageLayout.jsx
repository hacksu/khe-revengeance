import { useEffect, useMemo, useState, useRef } from "react";
import { remult } from "remult";
import { Layout } from "antd";
const { Sider } = Layout;
import { DragOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import { Resizable } from "re-resizable";

import KHEStaffLayout from "../layouts/layout";
import { GridImage } from "../../global-includes/image-grid";
import EditableMenu from "../components/editableMenuItems";
import { PlusCircleOutlined } from "@ant-design/icons";

import style from "./imageLayout.module.css";

function ImageRow({ images, justifyContent, addBlobURL }) {

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"]
        },
        onDropAccepted: (files) => {
            console.log(files);
            for (const file of files) {
                const isImage = file.type === 'image/png' || file.type === "image/jpeg";
                if (!isImage) {
                    alert(`${file.name} is not a png or jpg file :(`);
                } else {
                    addBlobURL(URL.createObjectURL(file));
                }
            }
        },
        noClick: true,
        multiple: true
    });
    return <div style={{ display: "flex", alignItems: "center" }}>
        <div {...getRootProps()} style={{
            display: "flex",
            justifyContent: justifyContent || "space-evenly",
            alignItems: "center",
            width: 600,
            backgroundColor: "lightgray",
            borderRadius: 5,
            minHeight: 50,
            marginBottom: 5
        }}>
            <input {...getInputProps()} />
            {
                images?.length ?
                    images.map(i => (
                        <Resizable lockAspectRatio={true} key={i.tempURL || i.id}
                            maxWidth="100%" handleComponent={{
                                bottomRight: <div className={style.resizeHandle}><span>⤡</span></div>
                            }} handleStyles={{ bottomRight: { zIndex: 100 } }} >
                            <img src={i.tempURL || i.filename} className={style.imageInRow} />
                        </Resizable>
                    )) : <span>Drag and drop images here or click the plus icon</span>

            }

        </div>
        <div style={{ padding: 20 }}>
            <PlusCircleOutlined onClick={open} />
        </div>
    </div >;
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
        if (rows.length && rows[rows.length - 1].length != 0) {
            rows.push([]);
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
        <Layout style={{ height: "100%", overflowY: "auto" }}>
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
            </div> : null}
        </Layout>
    </KHEStaffLayout>
}
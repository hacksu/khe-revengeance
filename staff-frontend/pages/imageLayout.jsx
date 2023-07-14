import { useEffect, useMemo, useState, useRef } from "react";
import { remult } from "remult";
import { Layout } from "antd";
const { Sider } = Layout;
import { useDropzone } from "react-dropzone";
import { Resizable } from "re-resizable";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import KHEStaffLayout from "../layouts/layout";
import { GridImage } from "../../global-includes/image-grid";
import EditableMenu from "../components/editableMenuItems";
import { PlusCircleOutlined } from "@ant-design/icons";

import style from "./imageLayout.module.css";

function Image({ image }) {
    const [dragDisabled, setDragDisabled] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isSorting
    } = useSortable({ id: image.id, disabled: dragDisabled });
    const sortableStyle = {
        transform: CSS.Transform.toString(
            transform && { ...transform, scaleY: 1, scaleX: 1 }
        ),
        transition,
    };
    const disableDrag = () => {
        console.log("drag stop");
        setDragDisabled(true);
    }
    const i = image;
    return <Resizable lockAspectRatio={true} maxWidth="100%"
        handleComponent={{
            bottomRight: (
                <div style={{ visibility: isSorting ? "hidden" : "" }}
                    className={style.resizeHandle}>
                    <span>⤡</span>
                </div>)
        }}
        handleStyles={{ bottomRight: { zIndex: 100 } }}
        onResizeStart={disableDrag}
        onResizeStop={() => setDragDisabled(false)} >
        <div ref={setNodeRef} style={sortableStyle} {...attributes} {...listeners}>
            <img src={i.tempURL || i.filename} className={style.imageInRow} />
        </div>
    </Resizable>
}

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
                    <SortableContext
                        items={images.map(image => image.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {images.map(i => <Image image={i} key={i.id} />)}
                    </SortableContext> :
                    <span>Drag and drop images here or click the plus icon</span>
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
    }, [images]);
    const imageIndex = useMemo(() => {
        const index = {};
        for (const image of images) {
            index[image.id] = image;
        }
        return index;
    }, [images]);
    const menuNavigation = (click) => {
        setOpenGrid(click.key);
    };
    const addImage = (row, url) => {
        setImages(i => {
            let col = 0;
            for (const image of i) {
                if (image.row == row && image.col >= col) {
                    col = image.col + 1;
                }
            }
            return i.concat(
                [{ ...new GridImage(), gridName: openGrid, row, col, tempURL: url, id: url }]
            )
        });
    };
    const sensors = useSensors(useSensor(PointerSensor));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        console.log(event);
        if (active.id !== over.id) {
            console.log("moved?");
            const moved = imageIndex[active.id];
            const pushed = imageIndex[over.id];
            setImages(i => {
                const newImages = [];
                for (const image of i) {
                    if (image.id == moved.id) {
                        newImages.push({ ...image, row: pushed.row, col: pushed.col });
                    } else {
                        let deltaCol = 0;
                        newImages.push({ ...image, col: image.col + deltaCol });
                    }
                }
                return newImages;
            });
        }
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
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {(grids.length || true) ? <div>
                    {sortedImages.map((row, i) =>
                        <ImageRow key={i} images={row} addBlobURL={(url) => addImage(i, url)} />
                    )}
                </div> : null}
            </DndContext>
        </Layout>
    </KHEStaffLayout>
}
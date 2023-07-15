import { useEffect, useMemo, useState } from "react";
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
    useDroppable,
    DragOverlay,
} from '@dnd-kit/core';
import {
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

function debugDuplicates(images) {
    const ids = new Set();
    const coords = new Set();
    for (const image of images) {
        if (ids.has(image.id)) {
            console.log("duplicate id", image.id);
            console.trace();
        }
        ids.add(image.id);
        const coord = image.row + "," + image.col;
        if (coords.has(coord)) {
            console.log("duplicate coords", coord);
            console.trace();
        }
        coords.add(coord);
    }
    return images;
}

const getImageSize = url => new Promise(resolve => {
    const image = document.createElement("img");
    image.onload = () => {
        let width = image.naturalWidth;
        let height = image.naturalHeight;
        if (width > 200) {
            height *= 200 / width;
            width = 200;
        }
        if (height > 200) {
            width *= 200 / height;
            height = 200;
        }
        resolve({ width, height });
    }
    image.src = url;
});

function Image({ image: i, css }) {
    return <img src={i.tempURL || i.filename} className={style.imageInRow} style={css} />;
}

function ImageTile({ image, onResize }) {
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
        setDragDisabled(true);
    }
    const i = image;
    return <Resizable maxWidth="100%" lockAspectRatio
        size={{ height: i.height, width: i.width }}
        handleComponent={{
            bottomRight: (
                <div style={{ visibility: isSorting ? "hidden" : "" }}
                    className={style.resizeHandle}>
                    <span>⤡</span>
                </div>)
        }}
        handleStyles={{ bottomRight: { zIndex: 100 } }}
        onResizeStart={disableDrag}
        onResizeStop={(event, direction, ref, d) => {
            setDragDisabled(false);
            onResize({ id: i.id, width: i.width + d.width, height: i.height + d.height });
        }}>
        <div ref={setNodeRef} style={sortableStyle} {...attributes} {...listeners}>
            <Image image={image} />
        </div>
    </Resizable>
}

function ImageRow({ index, images, justifyContent, onResize, addBlobURL }) {
    const { getRootProps, getInputProps, open } = useDropzone({
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"]
        },
        onDropAccepted: (files) => {
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
    const { setNodeRef } = useDroppable({ id: "row" + index })
    return <div style={{ display: "flex", alignItems: "center" }} ref={setNodeRef}>
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
            {images.length == 0 ? <span>Drag and drop images here or click the plus icon</span> : null}
            <SortableContext
                items={images.map(image => image.id)}
                strategy={horizontalListSortingStrategy}
            >
                {images.map((i) => <ImageTile image={i} key={i.id} onResize={onResize} />)}
            </SortableContext>

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
    const addImage = async (row, url) => {
        const dimensions = await getImageSize(url);
        setImages(i => {
            // Math.max returns -Infinity when i is empty (when there are no images yet)
            const currentHighestCol = Math.max(
                ...i.map(image => image.row != row ? 0 : image.col)
            );
            const result = i.concat(
                [{
                    ...new GridImage(),
                    gridName: openGrid,
                    row, col: currentHighestCol == -Infinity ? 0 : currentHighestCol + 1,
                    ...dimensions,
                    tempURL: url, id: url
                }]
            );
            return debugDuplicates(result);
        });
    };
    const sensors = useSensors(useSensor(PointerSensor));
    // needs to be called when an image is drug over a new row or dropped into
    // any row
    const handleImageMove = (event, fromDragOver = false) => {
        console.log("moving image");
        console.log(event);
        if (!fromDragOver) {
            setActiveID(null);
        }
        const { active, over, collisions } = event;
        if (active.id !== over.id) {
            const overRowID = collisions.find(c => c.id.startsWith("row"))?.id;
            if (!overRowID) {
                // give up
                return;
            }
            const overRow = Number(overRowID.slice(3));
            const replacing = collisions.find(c => imageIndex[c.id]?.row === overRow);
            let dest;
            if (!replacing) {
                dest = { row: overRow, col: 0 };
            } else {
                dest = imageIndex[replacing.id];
            }
            console.log("dest", dest);
            const moved = imageIndex[active.id];

            // let dest;
            // if (over.id.startsWith("row")) {
            //     const overRow = Number(over.id.slice(3));
            //     dest = { row: overRow, col: sortedImages[overRow].length };
            // } else {
            //     dest = imageIndex[over.id];
            // }

            setImages((i) => {
                const newImages = [];
                const rows = sortedImages.map(r => [...r]);
                rows[moved.row] = rows[moved.row].filter(i => i.id != moved.id);
                rows[dest.row] = rows[dest.row].slice(0, dest.col)
                    .concat([moved])
                    .concat(rows[dest.row].slice(dest.col));
                let r = 0;
                for (const row of rows.filter(q => q.length)) {
                    let col = 0;
                    for (const image of row) {
                        newImages.push({ ...image, row: r, col });
                        col += 1;
                    }
                    r += 1;
                }
                console.log("before images:");
                console.log(i);
                console.log("before sorted images:")
                console.log(sortedImages);
                return debugDuplicates(newImages);
            });
        }
    }
    const handleDragOver = (event) => {
        if (event.over.id.startsWith("row")) {
            console.log("image drug over row");
            console.log(event);
            handleImageMove(event, true);
        } else {
            console.log("image drug over other image");
            console.log(event);
            if (imageIndex[event.active.id].row != imageIndex[event.over.id].row) {
                handleImageMove(event, true);
            }
        }
    }
    const onResize = (newDimensions) => {
        setImages(images => [{ ...imageIndex[newDimensions.id], ...newDimensions }]
            .concat(images.filter(i => i.id != newDimensions.id))
        );
    };
    const [activeID, setActiveID] = useState(null);
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
                onDragStart={e => setActiveID(e.active.id)}
                onDragEnd={handleImageMove}
                onDragOver={handleDragOver}
            >
                {(grids.length || true) ? <div>
                    {sortedImages.map((row, i) =>
                        <ImageRow key={i} index={i} images={row} onResize={onResize}
                            addBlobURL={(url) => addImage(i, url)} />
                    )}
                </div> : null}
                <DragOverlay>
                    {activeID != null ?
                        <Image image={imageIndex[activeID]} css={{ opacity: 0.3 }} />
                        : null}
                </DragOverlay>
            </DndContext>
        </Layout>
    </KHEStaffLayout>
}
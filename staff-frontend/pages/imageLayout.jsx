import { useEffect, useMemo, useState, useRef } from "react";
import { remult } from "remult";
import { Form, Layout, Modal, Input, Button, Space } from "antd";
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
import { GridImage, accessImagePath } from "../../global-includes/image-grid";
import EditableMenu from "../components/editableMenuItems";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";

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
    return <img src={i.tempURL || accessImagePath + i.filename}
        className={style.imageInRow} style={css} />;
}

function ImageTile({ image, onResize, onEdit, onDelete }) {
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
    const [editModalOpen, setEditModalOpen] = useState(false);
    const editInfo = (event) => {
        // doesn't work :/ you can still see it start to drag for a second
        event.nativeEvent.stopImmediatePropagation();
        event.nativeEvent.stopPropagation();
        event.stopPropagation();
        event.preventDefault();

        setEditModalOpen(true);
    }
    const updateInfo = (values) => {
        setEditModalOpen(false);
        onEdit({ ...i, ...values });
    };
    const i = image;
    return <>
        <Resizable maxWidth="100%" lockAspectRatio
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
                <div style={{ visibility: isSorting ? "hidden" : "" }}
                    onMouseDown={editInfo} onTouchStart={editInfo}
                    className={style.editInfo}>
                    <EditOutlined />
                </div>
                <div style={{ visibility: isSorting ? "hidden" : "" }}
                    onMouseDown={() => onDelete(i.id)} onTouchStart={() => onDelete(i.id)}
                    className={style.deleteImage}>
                    <DeleteOutlined />
                </div>
            </div>
        </Resizable>
        <Modal
            title="Edit Image Info"
            open={editModalOpen}
            footer={null}
            onCancel={() => setEditModalOpen(false)}
        >
            <Form onFinish={updateInfo} layout="vertical"
                initialValues={{
                    description: i.description || "",
                    linksTo: i.linksTo || "",
                    notes: i.notes || ""
                }}>
                <Form.Item name="description"
                    label="Image description (for hover text):">
                    <Input />
                </Form.Item>
                <Form.Item name="linksTo"
                    label="URL to link to:">
                    <Input />
                </Form.Item>
                <Form.Item name="notes"
                    label="Extra notes:">
                    <Input />
                </Form.Item>
                <Space >
                    <Button type="primary" htmlType="submit">
                        Set
                    </Button>
                    <Button onClick={() => setEditModalOpen(false)}>
                        Cancel
                    </Button>
                </Space>
            </Form>
        </Modal>
    </>
}

function ImageRow({ index, images, justifyContent, onResize, onEdit, onDelete, addImageFile }) {
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
                    addImageFile(file);
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
                {images.map((i) => (
                    <ImageTile image={i} key={i.id} onResize={onResize}
                        onEdit={onEdit} onDelete={onDelete} />
                ))}
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
    const files = useRef({});
    const addImage = async (row, file) => {
        const url = URL.createObjectURL(file);
        files.current[url] = file;
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
                    tempURL: url, id: url,
                    needsUploading: true
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
        if (!over) {
            return;
        }
        if (active.id !== over.id) {
            // figure out what row the image has been dragged over and then
            // place it in the position of the closest image in that row
            const moved = imageIndex[active.id];
            const overRowID = collisions.find(c => c.id.startsWith("row"))?.id;
            if (!overRowID || !moved) {
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

            setImages((i) => {
                const newImages = [];
                // instead of trying to update the row and col fields in the
                // objects in the images array directly, this just creates a new
                // 2-dimensional array with the images in the right spots and
                // derives the row and col values from there
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
            if (imageIndex[event.active.id] &&
                imageIndex[event.active.id].row != imageIndex[event.over.id].row) {
                handleImageMove(event, true);
            }
        }
    }
    // TODO: this could be done through handleEdit
    const handleResize = (newDimensions) => {
        setImages(images => [{ ...imageIndex[newDimensions.id], ...newDimensions }]
            .concat(images.filter(i => i.id != newDimensions.id))
        );
    };
    const handleDelete = (id) => {
        setImages(images => images.filter(i => i.id != id));
        if (id.startsWith("blob:")) {
            URL.revokeObjectURL(id);
        }
    }
    const handleEdit = (newVersion) => {
        const updated = images.map(i => i.id == newVersion.id ? newVersion : i);
        setImages(updated);
        console.log("images after edit", updated);
    }
    const [uploadQueue, setUploadQueue] = useState([]);
    const [justSaved, setJustSaved] = useState(false);
    const uploadAll = async () => {
        // TODO: don't save unless the current grid has a valid name (the
        // default "__add" from editableMenuItems shouldn't be considered valid)
        const uploadPromises = [];
        let localImages = images;
        for (const image of images) {
            if (image.needsUploading) {
                setUploadQueue(q => q.concat(image.tempURL));
                const upload = new FormData();
                upload.set("image", files.current[image.tempURL]);
                uploadPromises.push(fetch("/newimage", {
                    method: 'POST',
                    body: upload
                }).then(async (resp) => {
                    setUploadQueue(q => q.filter(i => i != image.tempURL));
                    URL.revokeObjectURL(image.tempURL);
                    delete files.current[image.tempURL];
                    const newFilename = await resp.text();
                    localImages = localImages.map(j => j.id == image.id ? {
                        ...j, needsUploading: false, tempURL: undefined,
                        filename: newFilename
                    } : j);
                    console.log("new filename", newFilename);
                    console.log(localImages);
                    setImages(localImages);
                }));
            }
        }
        await Promise.all(uploadPromises);
        console.log("local images at set grid time", localImages);
        await GridImage.setGrid(openGrid, localImages);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 5000);
    }
    const [activeID, setActiveID] = useState(null);
    return <KHEStaffLayout>
        <Layout style={{ height: "100%", overflowY: "auto" }}>
            <Sider width={300} theme="light">
                <EditableMenu title="Image Layouts" mode="inline" onClick={menuNavigation}
                    labels={grids} selectedKeys={[openGrid || grids[0] || null]}
                    onAdd={(name) => { setGrids(g => g.concat(name)); setOpenGrid(name) }}
                    onEdit={(index, newGridName) => {
                        setGrids(g => g.slice(0, index)
                            .concat([newGridName])
                            .concat(g.slice(index + 1)));
                        // TODO: bulk rename
                    }}
                />
            </Sider>
            {(openGrid.length) ? <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={e => setActiveID(e.active.id)}
                    onDragEnd={handleImageMove}
                    onDragOver={handleDragOver}
                >
                    <div>
                        {sortedImages.map((row, i) =>
                            <ImageRow key={i} index={i} images={row}
                                onResize={handleResize} onDelete={handleDelete} onEdit={handleEdit}
                                addImageFile={(file) => addImage(i, file)} />
                        )}
                    </div>
                    <DragOverlay>
                        {activeID != null && imageIndex[activeID] ?
                            <Image image={imageIndex[activeID]} css={{ opacity: 0.3 }} />
                            : null}
                    </DragOverlay>
                </DndContext>
                {uploadQueue.length ? <div
                    style={{ display: "flex", height: 50, alignItems: "center", gap: 10 }}>
                    <span>Upload queue:</span>
                    {uploadQueue.map(url => <img style={{ height: "100%" }} src={url} />)}
                </div> : null}
                <Button type="primary" disabled={images.length < 1}
                    onClick={uploadAll}>Save</Button>
                {justSaved ? <p>Saved!</p> : null}</div>
                : <p>Create or select an image grid using the menu on the left.</p>}
        </Layout>
    </KHEStaffLayout>
}
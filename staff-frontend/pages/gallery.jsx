import RUG from 'react-upload-gallery'
import 'react-upload-gallery/dist/style.css'
import { remult } from 'remult';

import KHEStaffLayout from '../layouts/layout';
import { Gallery, galleryURLPath } from '../../global-includes/image-gallery';
import { useEffect, useRef, useState } from 'react';

const galleryName = "default";
const thumbnailSuffix = "?thumb=1";

// gets the last segment of a URL path
const getFilenameFromURL = (url) => 
  new URL(url, window.location.origin).pathname.split('/').pop();

const getURLFromFilename = (filename) => 
  galleryURLPath + filename + thumbnailSuffix;

export default function GalleryEditor() {

  const [initialState, setInitialState] = useState([]);
  // TODO: use suspense?
  const [initialStateLoaded, setInitialStateLoaded] = useState(false);

  const hashes = useRef({});

  useEffect(() => {
    const repo = remult.repo(Gallery);
    repo.findFirst({id: galleryName}).then(gallery => {
      if (gallery) {
        const sources = [];
        for (const image of gallery.images) {
          sources.push({source: getURLFromFilename(image.filename)});
          hashes.current[image.filename] = image.hash;
        }
        setInitialState(sources);
      }
      setInitialStateLoaded(true);
    });
  }, []);

  // TODO: add <EditableMenu /> for multiple galleries?
  return <KHEStaffLayout >
    {initialStateLoaded ?
      <div style={{overflowY: "auto", overflowX: "hidden", height: "100%"}}>
        <RUG
          action="/newimage"
          source={response => {
            hashes.current[response.source] = response.hash;
            return getURLFromFilename(response.source);
          }}
          initialState={initialState}
          onChange={async images => {
            const uploaded = [];
            for (const image of images) {
              if (image.done) {
                const filename = getFilenameFromURL(image.source);
                uploaded.push({
                  filename,
                  hash: hashes.current[filename]
                });
              }
            }
            await Gallery.upsert(galleryName, uploaded);
          }}
          onDeleted={image => {
            fetch(
              "/deleteImage/"+getFilenameFromURL(image.source),
              { method: "POST" }
            ).catch(err => {
              console.error("could not delete image:", image);
            });
          }}
        /></div> : "loading."}
  </KHEStaffLayout>;
}

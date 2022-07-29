import React, { useState, useRef } from "react";
import styled from "styled-components";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview.ts";
import { useDebounceEffect } from "./useDebounceEffect.ts";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
const Container = styled.div`
  padding: 30px;
  width: 100%;
  height: 600px;
`;

const App = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  height: 90%;
  padding: 5px;
`;
const InputButton = styled.label`
  color: var(--malon-color);
  border: 1px solid var(--malon-color);
  border-radius: 0.2rem;
  text-transform: capitalize;
  padding: 3px 5px;
`;
const Done = styled.label`
  color: var(--white-color);
  background: var(--orange-color);
  border-radius: 0.2rem;
  text-transform: capitalize;
  padding: 3px 5px;
`;

const imageMaxSize = 1000000000; // bytes
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {
  return item.trim();
});

export default function CropImage({
  uploadHandler,
  setShowModel,
  currentImage,
}) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const aspect = 9 / 14;
  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  const verifyFile = (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert(
          "This file is not allowed. " + currentFileSize + " bytes is too large"
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("This file is not allowed. Only images are allowed.");
        return false;
      }
      return true;
    }
  };

  function extractImageFileExtensionFromBase64(base64Data) {
    return base64Data.substring(
      "data:image/".length,
      base64Data.indexOf(";base64")
    );
  }

  function base64StringtoFile(base64String, filename) {
    var arr = base64String.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = (e) => {
    if (imgSrc) {
      const fileExtension = extractImageFileExtensionFromBase64(imgSrc);
      const cropData = previewCanvasRef.current.toDataURL(
        "image/" + fileExtension
      );
      const fileName = "previewedFile." + fileExtension;
      const myFile = base64StringtoFile(cropData, fileName);
      uploadHandler(myFile, currentImage);
      setShowModel(false);
    }
  };

  return (
    <Container>
      <InputButton htmlFor="inputButton">Add an image</InputButton>
      <App>
        <div>
          <input
            id="inputButton"
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
          />
          {Boolean(imgSrc) && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                style={{ width: "400px" }}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
        <div>
          {Boolean(completedCrop) && (
            <canvas
              ref={previewCanvasRef}
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop && "350px",
              }}
            />
          )}
        </div>
      </App>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "flex-end",
        }}
      >
        <Done onClick={() => handleSubmit()}>Done</Done>
      </div>
    </Container>
  );
}

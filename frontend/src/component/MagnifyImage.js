import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Main = styled.div`
  display: flex;
  position: relative;
  flex: 3;
  & img {
    cursor: none;
    width: 100%;
  }

  & .img-magnifier-glass {
    position: absolute;
    border: 3px solid #000;
    cursor: none;
    /*Set the size of the magnifier glass:*/
    width: 100px;
    height: 100px;
  }
`;

const Preview = styled.div`
  position: absolute;
  right: -300px;
  top: 0;
  height: 300px;
  width: 300px;
  margin-left: 20px;
  background-repeat: no-repeat;
`;

export default function MagnifyImage({ imgsrc, zoom }) {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  
  const imgRef = useRef();
  const previewRef = useRef();
  const glassRef = useRef();

  const magnifierHeight=100
  const magnifieWidth=100
  const zoomLevel = 3

 

  return (<>
      <div
        style={{
          position: "relative",
          height: '100%',
          width: '100%'
        }}
      >
        <img
          src={imgsrc}
          style={{  width: '100%' }}
          onMouseEnter={(e) => {
            // update image size and turn-on magnifier
            const elem = e.currentTarget;
            const { width, height } = elem.getBoundingClientRect();
            setSize([width, height]);
            setShowMagnifier(true);
          }}
          onMouseMove={(e) => {
            // update cursor position
            const elem = e.currentTarget;
            const { top, left } = elem.getBoundingClientRect();
  
            // calculate cursor position on the image
            const x = e.pageX - left - window.pageXOffset;
            const y = e.pageY - top - window.pageYOffset;
            setXY([x, y]);
          }}
          onMouseLeave={() => {
            // close magnifier
            setShowMagnifier(false);
          }}
          alt={"img"}
        />
  
        <div
          style={{
            display: showMagnifier ? "" : "none",
            position: "absolute",
  
            // prevent maginier blocks the mousemove event of img
            pointerEvents: "none",
            // set size of magnifier
            height: `${magnifierHeight}px`,
            width: `${magnifieWidth}px`,
            // move element center to cursor pos
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifieWidth / 2}px`,
            opacity: "1", // reduce opacity so you can verify position
            border: "1px solid lightgray",
          }}
        ></div>
      <Preview style={{
            display: showMagnifier ? "" : "none",
            position: "absolute",
            border: "1px solid lightgray",
            backgroundColor: "white",
            backgroundImage: `url('${imgsrc}')`,
            backgroundRepeat: "no-repeat",
  
            //calculate zoomed image size
            backgroundSize: `${imgWidth * zoomLevel}px ${
              imgHeight * zoomLevel
            }px`,
            //calculete position of zoomed image.
            backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`
            
            }} 
            ></Preview>
      </div></>
  );
}

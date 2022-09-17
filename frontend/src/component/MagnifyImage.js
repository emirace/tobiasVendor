import React, { useEffect, useRef } from "react";
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
  display: none;
  top: 0;
  height: 300px;
  width: 300px;
  margin-left: 20px;
  background-repeat: no-repeat;
`;

export default function MagnifyImage({ imgsrc, zoom }) {
  const imgRef = useRef();
  const previewRef = useRef();

  //function moveMagnifier(e) {}

  function getCursorPos(e, img) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    a = img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }

  // img.addEventListener("mouseleave", () => {
  //   preview.style.backgroundImage = "none";
  //   glass.remove();
  // });

  /* Create magnifier glass: */
  var glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");

  const text = (e) => {
    var img = imgRef.current;
    var preview = previewRef.current;

    /* Set background properties for the magnifier glass: */
    previewRef.current.style.display = "block";
    preview.style.backgroundImage = "url('" + img.src + "')";
    preview.style.backgroundRepeat = "no-repeat";
    preview.style.backgroundSize =
      img.width * zoom + "px " + img.height * zoom + "px";
    /* Insert magnifier glass: */
    img.parentElement.insertBefore(glass, img);

    var w = glass.offsetWidth / 2;
    var h = glass.offsetHeight / 2;
    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e, img);
    x = pos.x;
    y = pos.y;
    /* Prevent the magnifier glass from being positioned outside the image: */
    if (x > img.width - w) {
      x = img.width - w;
    }
    if (x < 0 + w) {
      x = 0 + w;
    }
    if (y > img.height - h) {
      y = img.height - h;
    }
    if (y < 0 + h) {
      y = 0 + h;
    }
    /* Set the position of the magnifier glass: */
    glass.style.display = "block";
    glass.style.left = x - w + "px";
    glass.style.top = y - h + "px";
    /* Display what the magnifier glass "sees": */
    preview.style.backgroundPosition =
      "-" +
      (x * zoom - preview.offsetWidth / 2) +
      "px -" +
      (y * zoom - preview.offsetHeight / 2) +
      "px";
  };

  const leaving = () => {
    console.log(previewRef.current);
    previewRef.current.style.display = "none";
    glass.remove();
  };
  const enter = () => {
    console.log(previewRef.current);
  };

  return (
    <Main className="main">
      <img
        ref={imgRef}
        onMouseEnter={enter}
        onMouseMove={(e) => text(e)}
        onMouseLeave={leaving}
        src={imgsrc}
        id="gfg-img"
      />
      <Preview ref={previewRef} className="zoom-preview"></Preview>
    </Main>
  );
}

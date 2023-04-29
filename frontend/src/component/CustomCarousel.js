import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Carousel = ({ children, autoScrollInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = children.length;
  const intervalRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handlePrevClick = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const handleNextClick = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      setCurrentSlide(currentSlide + 1);
    }

    if (touchStart - touchEnd < -50) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // useEffect(() => {
  //   intervalRef.current = setInterval(() => {
  //     setCurrentSlide((currentSlide + 1) % totalSlides);
  //   }, autoScrollInterval);

  //   return () => {
  //     clearInterval(intervalRef.current);
  //   };
  // }, [currentSlide, autoScrollInterval, totalSlides]);

  return (
    <CarouselContainer>
      <SlidesContainer
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {React.Children.map(children, (child, index) => (
          <Slide key={index} onClick={() => handleSlideClick(index)}>
            {child}
          </Slide>
        ))}
      </SlidesContainer>
      <Pagination>
        {Array.from({ length: totalSlides }, (_, index) => (
          <Dot
            key={index}
            active={currentSlide === index}
            onClick={() => handleSlideClick(index)}
          />
        ))}
      </Pagination>
    </CarouselContainer>
  );
};

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const SlidesContainer = styled.div`
  display: flex;
  width: ${(props) => props.children.length * 100}%;
  transition: transform 1s;
`;

const Slide = styled.div`
  flex-shrink: 0;
  width: 100%;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.active ? "var(--orange-color)" : "#ccc"};
  margin-right: 8px;
  cursor: pointer;
`;

export default Carousel;

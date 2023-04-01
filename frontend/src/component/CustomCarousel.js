import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Carousel = ({ children, autoScrollInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = children.length;
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    setActiveIndex(index);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((currentSlide + 1) % totalSlides);
      setActiveIndex((activeIndex + 1) % totalSlides);
    }, autoScrollInterval);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [currentSlide, autoScrollInterval, totalSlides, activeIndex]);

  const dots = [];
  for (let i = 0; i < totalSlides; i++) {
    dots.push(
      <Dot
        key={i}
        active={i === activeIndex}
        onClick={() => handleDotClick(i)}
      />
    );
  }

  return (
    <CarouselContainer ref={containerRef}>
      <SlidesContainer
        style={{
          transform: `translate(-${currentSlide * (100 / totalSlides)}%, -50%)`,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          height: '100%',
        }}
      >
        {React.Children.map(children, (child, index) => (
          <Slide
            key={index}
            onClick={() => handleSlideClick(index)}
            style={{
              flex: `0 0 ${100 / totalSlides}%`,
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            {child}
          </Slide>
        ))}
      </SlidesContainer>
      <DotsContainer>{dots}</DotsContainer>
    </CarouselContainer>
  );
};

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 100%;
`;

const SlidesContainer = styled.div`
  transition: transform 1s;
`;

const Slide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const Dot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin: 0.5rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? 'var(--orange-color)' : 'gray'};
`;

export default Carousel;

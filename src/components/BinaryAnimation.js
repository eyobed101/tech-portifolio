import React from 'react';
import styled, { keyframes } from 'styled-components';

const moveUp = keyframes`
  0% { 
    top: 110%;
    transform: translateX(0); 
    opacity: 0; 
  }
  10% { opacity: var(--final-opacity); }
  25% { transform: translateX(15px); }
  50% { transform: translateX(0); }
  75% { transform: translateX(-15px); }
  90% { opacity: var(--final-opacity); }
  100% { 
    top: -10%;
    transform: translateX(0); 
    opacity: 0; 
  }
`;

const AnimationWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  font-family: var(--font-mono);
  color: var(--green);
  pointer-events: none;
  user-select: none;

  .bit {
    position: absolute;
    font-size: var(--fz-md);
    animation: ${moveUp} linear infinite;
    animation-delay: var(--delay);
    animation-duration: var(--duration);
    left: var(--left);
    opacity: 0;
    font-weight: 500;
  }
`;

const BinaryAnimation = () => {
  const bitsCount = 150;

  return (
    <AnimationWrapper>
      {[...Array(bitsCount)].map((_, i) => {
        const char = Math.random() > 0.5 ? '0' : '1';
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 15;
        const left = Math.random() * 100;
        const opacity = 0.2 + Math.random() * 0.4;

        return (
          <div
            key={i}
            className="bit"
            style={{
              '--delay': `${delay}s`,
              '--duration': `${duration}s`,
              '--left': `${left}%`,
              '--final-opacity': opacity,
            }}>
            {char}
          </div>
        );
      })}
    </AnimationWrapper>
  );
};

export default BinaryAnimation;

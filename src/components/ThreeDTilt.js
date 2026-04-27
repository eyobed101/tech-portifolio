import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTiltWrapper = styled.div`
  position: relative;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const ThreeDTilt = ({ children, maxTilt = 10, scale = 1.02 }) => {
    const wrapperRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!wrapperRef.current) return;

        const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        const tiltX = (y - 0.5) * -maxTilt;
        const tiltY = (x - 0.5) * maxTilt;

        setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    return (
        <StyledTiltWrapper
            ref={wrapperRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: isHovered
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${scale}, ${scale}, ${scale})`
                    : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
            }}
        >
            {children}
        </StyledTiltWrapper>
    );
};

ThreeDTilt.propTypes = {
    children: PropTypes.node.isRequired,
    maxTilt: PropTypes.number,
    scale: PropTypes.number,
};

export default ThreeDTilt;

import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Mesh, Program, Geometry } from 'ogl';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.15;
  pointer-events: none;
`;

const ThreeDBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({ alpha: true });
        const gl = renderer.gl;
        containerRef.current.appendChild(gl.canvas);

        const camera = new Camera(gl, { fov: 35 });
        camera.position.z = 20;

        const scene = new Transform();

        const vertex = `
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      varying float vDistortion;

      void main() {
        vec3 pos = position;
        float distortion = sin(pos.x * 0.5 + uTime) * cos(pos.y * 0.5 + uTime) * 0.5;
        pos.z += distortion;
        vDistortion = distortion;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

        const fragment = `
      precision highp float;
      varying float vDistortion;
      void main() {
        gl_FragColor.rgb = vec3(0.39, 1.0, 0.77) * (vDistortion + 0.5);
        gl_FragColor.a = 0.5;
      }
    `;

        // Create a plane geometry with many segments
        const geometry = new Geometry(gl, {
            position: { size: 3, data: new Float32Array(createGrid(20, 20)) },
        });

        function createGrid(width, height) {
            const positions = [];
            for (let i = 0; i <= width; i++) {
                for (let j = 0; j <= height; j++) {
                    const x = (i / width - 0.5) * 30;
                    const y = (j / height - 0.5) * 30;
                    positions.push(x, y, 0);
                }
            }
            return positions;
        }

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
            },
            mode: gl.LINES,
        });

        const mesh = new Mesh(gl, { geometry, program });
        mesh.setParent(scene);

        let request;
        const update = (t) => {
            request = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            mesh.rotation.z += 0.001;
            renderer.render({ scene, camera });
        };
        request = requestAnimationFrame(update);

        const handleResize = () => {
            const { width, height } = containerRef.current.getBoundingClientRect();
            renderer.setSize(width, height);
            camera.perspective({ aspect: width / height });
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            cancelAnimationFrame(request);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && gl.canvas.parentNode) {
                containerRef.current.removeChild(gl.canvas);
            }
        };
    }, []);

    return <BackgroundContainer ref={containerRef} />;
};

export default ThreeDBackground;

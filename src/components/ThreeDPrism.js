import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Mesh, Program, Geometry, Color } from 'ogl';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const ThreeDPrism = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({ alpha: true, antialias: true });
        const gl = renderer.gl;
        containerRef.current.appendChild(gl.canvas);

        const camera = new Camera(gl, { fov: 35 });
        camera.position.z = 5;

        const scene = new Transform();

        const vertex = `
      attribute vec3 position;
      attribute vec3 normal;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat3 normalMatrix;
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

        const fragment = `
      precision highp float;
      varying vec3 vNormal;
      void main() {
        vec3 normal = vNormal;
        float lighting = dot(normal, normalize(vec3(10, 10, 10)));
        gl_FragColor.rgb = vec3(0.39, 1.0, 0.77) * (lighting * 0.5 + 0.6);
        gl_FragColor.a = 1.0;
      }
    `;

        // Create a prism-like geometry (Tetrahedron)
        const geometry = new Geometry(gl, {
            position: {
                size: 3, data: new Float32Array([
                    0, 1, 0, -1, -1, 1, 1, -1, 1,
                    0, 1, 0, 1, -1, 1, 1, -1, -1,
                    0, 1, 0, 1, -1, -1, -1, -1, -1,
                    0, 1, 0, -1, -1, -1, -1, -1, 1,
                    -1, -1, 1, 1, -1, 1, 1, -1, -1,
                    -1, -1, 1, 1, -1, -1, -1, -1, -1
                ])
            },
            normal: {
                size: 3, data: new Float32Array([
                    0, 0.5, 0.8, 0, 0.5, 0.8, 0, 0.5, 0.8,
                    0.8, 0.5, 0, 0.8, 0.5, 0, 0.8, 0.5, 0,
                    0, 0.5, -0.8, 0, 0.5, -0.8, 0, 0.5, -0.8,
                    -0.8, 0.5, 0, -0.8, 0.5, 0, -0.8, 0.5, 0,
                    0, -1, 0, 0, -1, 0, 0, -1, 0,
                    0, -1, 0, 0, -1, 0, 0, -1, 0
                ])
            }
        });

        const program = new Program(gl, {
            vertex,
            fragment,
        });

        const mesh = new Mesh(gl, { geometry, program });
        mesh.setParent(scene);

        let request;
        const update = (t) => {
            request = requestAnimationFrame(update);
            mesh.rotation.y -= 0.01;
            mesh.rotation.x += 0.005;
            mesh.position.y = Math.sin(t * 0.002) * 0.1;
            renderer.render({ scene, camera });
        };
        request = requestAnimationFrame(update);

        const handleResize = () => {
            renderer.setSize(150, 150);
            camera.perspective({ aspect: 1 });
        };
        handleResize();

        return () => {
            cancelAnimationFrame(request);
            if (containerRef.current) {
                containerRef.current.removeChild(gl.canvas);
            }
        };
    }, []);

    return <CanvasContainer ref={containerRef} />;
};

export default ThreeDPrism;

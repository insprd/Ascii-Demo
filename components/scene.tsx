import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Scene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0);

    const camera = new THREE.PerspectiveCamera(
      75, // perspective zoom
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 2; // dolly zoom

    const renderer = new THREE.WebGLRenderer();
    const effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
    effect.setSize(window.innerWidth, window.innerHeight);
    effect.domElement.style.color = "white";
    effect.domElement.style.backgroundColor = "black";

    if (containerRef.current) {
      containerRef.current.appendChild(effect.domElement);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let model; 
    loader.load('models/Duck/Duck.gltf', (gltf) => {
      model = gltf.scene;
      scene.add(model); 
    });

    const controls = new TrackballControls(camera, effect.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    const animate = () => {
      requestAnimationFrame(animate);
      // Rotate your model or perform any animations you want
      if(model) {
        model.rotation.y += 0.005;
      }
      controls.update();
      effect.render(scene, camera);
    };
    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      effect.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    const onMouseDown = () => {
      effect.domElement.style.cursor = "grabbing";
    };
    const onMouseUp = () => {
      effect.domElement.style.cursor = "grab";
    };

    effect.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

  
    effect.domElement.style.cursor = "grab";

    return () => {
      window.removeEventListener("resize", onWindowResize);

      effect.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);

      if (containerRef.current) {
        containerRef.current.removeChild(effect.domElement);
      }
    };
  }, []);

  return <div ref={containerRef}  />;
};

export default Scene;

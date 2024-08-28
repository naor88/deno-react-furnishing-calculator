import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Closet3DViewProps {
  width: number;
  height: number;
  depth: number;
  doorColor: string;
  shelfColor: string;
  structureColor: string;
  dividerColor?: string; // New prop for divider color with an optional type
  sidePanelColor?: string; // New prop for side panel color with an optional type
  numDoors: number;
  numShelves: number;
}

const Closet3DView: React.FC<Closet3DViewProps> = ({
  width,
  height,
  depth,
  doorColor,
  shelfColor,
  structureColor,
  dividerColor = 'rgb(57, 255, 20)', // Default neon green color
  sidePanelColor = 'rgb(0, 0, 255)', // Default neon blue color
  numDoors,
  numShelves,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Cleanup previous scene
    while (mountRef.current && mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current!.clientWidth / mountRef.current!.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, height / 2, depth * 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current!.clientWidth,
      mountRef.current!.clientHeight
    );
    mountRef.current!.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, height, depth);
    scene.add(directionalLight);

    // Materials
    const structureMaterial = new THREE.MeshPhongMaterial({
      color: structureColor,
    });
    const shelfMaterial = new THREE.MeshPhongMaterial({ color: shelfColor });
    const dividerMaterial = new THREE.MeshPhongMaterial({ color: dividerColor });
    const sidePanelMaterial = new THREE.MeshPhongMaterial({ color: sidePanelColor });
    // Parse RGBA color for door material
    const [r, g, b, a] = doorColor.match(/\d+/g)?.map(Number) || [255,0,0,0.5];
    const doorMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(`rgb(${r}, ${g}, ${b})`),
      transparent: true,
      opacity: a / 255,
    });

    // Closet structure (sides, top, bottom, back)
    const thickness = 2; // Thickness of the panels

    // Left Side
    const leftSideGeometry = new THREE.BoxGeometry(thickness, height, depth);
    const leftSide = new THREE.Mesh(leftSideGeometry, sidePanelMaterial);
    leftSide.position.set(-width / 2 + thickness / 2, height / 2, 0);
    scene.add(leftSide);

    // Right Side
    const rightSide = leftSide.clone();
    rightSide.position.set(width / 2 - thickness / 2, height / 2, 0);
    scene.add(rightSide);

    // Top Panel
    const topGeometry = new THREE.BoxGeometry(
      width - 2 * thickness,
      thickness,
      depth
    );
    const topPanel = new THREE.Mesh(topGeometry, structureMaterial);
    topPanel.position.set(0, height - thickness / 2, 0);
    scene.add(topPanel);

    // Bottom Panel
    const bottomPanel = topPanel.clone();
    bottomPanel.position.set(0, thickness / 2, 0);
    scene.add(bottomPanel);

    // Back Panel
    const backGeometry = new THREE.BoxGeometry(
      width - 2 * thickness,
      height - 2 * thickness,
      thickness
    );
    const backPanel = new THREE.Mesh(backGeometry, structureMaterial);
    backPanel.position.set(0, height / 2, -depth / 2 + thickness / 2);
    scene.add(backPanel);

    // Shelves
    const shelfHeightGap = (height - 2 * thickness) / (numShelves + 1);
    const shelfWidth = width - 2 * thickness;
    const shelfDepth = depth - thickness;

    for (let i = 1; i <= numShelves; i++) {
      const shelfGeometry = new THREE.BoxGeometry(
        shelfWidth,
        thickness,
        shelfDepth
      );
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(0, i * shelfHeightGap, -thickness / 2); // Corrected shelf position
      scene.add(shelf);
    }

    // Internal Dividers
    const dividerWidth = thickness;
    const dividerHeight = height - 2 * thickness;
    const dividerDepth = depth - thickness;

    const numDividers = numDoors - 1;
    const dividerGap = width / numDoors;

    for (let i = 1; i <= numDividers; i++) {
      const dividerGeometry = new THREE.BoxGeometry(
        dividerWidth,
        dividerHeight,
        dividerDepth
      );
      const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
      divider.position.set(-width / 2 + i * dividerGap, height / 2, 0);
      scene.add(divider);
    }

    // Doors
    const doorWidth = (width - (numDoors + 1) * thickness) / numDoors;
    const doorHeight = height - thickness * 2;

    for (let i = 0; i < numDoors; i++) {
      const doorGeometry = new THREE.BoxGeometry(
        doorWidth,
        doorHeight,
        thickness
      );
      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.position.set(
        -width / 2 + thickness + doorWidth / 2 + i * (doorWidth + thickness),
        height / 2,
        depth / 2 - thickness / 2
      );
      scene.add(door);
    }

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, [
    width,
    height,
    depth,
    doorColor,
    shelfColor,
    structureColor,
    dividerColor, // Added dependency
    sidePanelColor, // Added dependency
    numDoors,
    numShelves,
  ]);

  return <div ref={mountRef} style={{ width: "100%", height: "600px" }} />;
};

export default Closet3DView;

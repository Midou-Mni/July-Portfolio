import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ProjectsBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating project icons
    const projectIcons = [];
    const iconGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const iconMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3B82F6, 
      transparent: true, 
      opacity: 0.3,
      wireframe: true 
    });

    for (let i = 0; i < 15; i++) {
      const icon = new THREE.Mesh(iconGeometry, iconMaterial);
      icon.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      icon.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      icon.userData = {
        speed: Math.random() * 0.02 + 0.01,
        rotationSpeed: Math.random() * 0.02 + 0.01
      };
      projectIcons.push(icon);
      scene.add(icon);
    }

    // Create floating code symbols
    const codeSymbols = [];
    const symbolGeometry = new THREE.SphereGeometry(0.2, 8, 6);
    const symbolMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x10B981, 
      transparent: true, 
      opacity: 0.2 
    });

    for (let i = 0; i < 20; i++) {
      const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
      symbol.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      );
      symbol.userData = {
        speed: Math.random() * 0.015 + 0.005,
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize()
      };
      codeSymbols.push(symbol);
      scene.add(symbol);
    }

    // Create connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x6366F1, 
      transparent: true, 
      opacity: 0.1 
    });

    for (let i = 0; i < 8; i++) {
      const points = [];
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ));
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ));
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }

    camera.position.z = 15;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate project icons
      projectIcons.forEach(icon => {
        icon.rotation.x += icon.userData.rotationSpeed;
        icon.rotation.y += icon.userData.rotationSpeed;
        icon.position.y += Math.sin(Date.now() * icon.userData.speed) * 0.01;
      });

      // Animate code symbols
      codeSymbols.forEach(symbol => {
        symbol.position.add(symbol.userData.direction.clone().multiplyScalar(symbol.userData.speed));
        
        // Wrap around if out of bounds
        if (Math.abs(symbol.position.x) > 12) symbol.userData.direction.x *= -1;
        if (Math.abs(symbol.position.y) > 12) symbol.userData.direction.y *= -1;
        if (Math.abs(symbol.position.z) > 12) symbol.userData.direction.z *= -1;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default ProjectsBackground; 
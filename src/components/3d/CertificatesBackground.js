import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CertificatesBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating certificate frames
    const certificateFrames = [];
    const frameGeometry = new THREE.PlaneGeometry(1, 1.4);
    const frameMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xF59E0B, 
      transparent: true, 
      opacity: 0.2,
      wireframe: true 
    });

    for (let i = 0; i < 12; i++) {
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18
      );
      frame.rotation.set(
        Math.random() * Math.PI * 0.5,
        Math.random() * Math.PI * 0.5,
        Math.random() * Math.PI * 0.5
      );
      frame.userData = {
        speed: Math.random() * 0.015 + 0.008,
        rotationSpeed: Math.random() * 0.01 + 0.005
      };
      certificateFrames.push(frame);
      scene.add(frame);
    }

    // Create floating achievement badges
    const achievementBadges = [];
    const badgeGeometry = new THREE.CircleGeometry(0.3, 8);
    const badgeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x8B5CF6, 
      transparent: true, 
      opacity: 0.25 
    });

    for (let i = 0; i < 18; i++) {
      const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
      badge.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22
      );
      badge.userData = {
        speed: Math.random() * 0.012 + 0.006,
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        ).normalize(),
        pulseSpeed: Math.random() * 0.02 + 0.01
      };
      achievementBadges.push(badge);
      scene.add(badge);
    }

    // Create floating stars/trophies
    const stars = [];
    const starGeometry = new THREE.OctahedronGeometry(0.15);
    const starMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFCD34D, 
      transparent: true, 
      opacity: 0.3 
    });

    for (let i = 0; i < 25; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      );
      star.userData = {
        speed: Math.random() * 0.018 + 0.01,
        rotationSpeed: Math.random() * 0.03 + 0.02,
        twinkleSpeed: Math.random() * 0.05 + 0.03
      };
      stars.push(star);
      scene.add(star);
    }

    // Create connecting achievement lines
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xF59E0B, 
      transparent: true, 
      opacity: 0.08 
    });

    for (let i = 0; i < 6; i++) {
      const points = [];
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      ));
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      ));
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }

    camera.position.z = 15;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate certificate frames
      certificateFrames.forEach(frame => {
        frame.rotation.x += frame.userData.rotationSpeed;
        frame.rotation.y += frame.userData.rotationSpeed;
        frame.position.y += Math.sin(Date.now() * frame.userData.speed) * 0.008;
      });

      // Animate achievement badges
      achievementBadges.forEach(badge => {
        badge.position.add(badge.userData.direction.clone().multiplyScalar(badge.userData.speed));
        badge.material.opacity = 0.25 + Math.sin(Date.now() * badge.userData.pulseSpeed) * 0.1;
        
        // Wrap around if out of bounds
        if (Math.abs(badge.position.x) > 11) badge.userData.direction.x *= -1;
        if (Math.abs(badge.position.y) > 11) badge.userData.direction.y *= -1;
        if (Math.abs(badge.position.z) > 11) badge.userData.direction.z *= -1;
      });

      // Animate stars
      stars.forEach(star => {
        star.rotation.x += star.userData.rotationSpeed;
        star.rotation.y += star.userData.rotationSpeed;
        star.position.y += Math.sin(Date.now() * star.userData.speed) * 0.006;
        star.material.opacity = 0.3 + Math.sin(Date.now() * star.userData.twinkleSpeed) * 0.15;
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

export default CertificatesBackground; 
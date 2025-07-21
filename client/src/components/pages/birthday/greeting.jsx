import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import './greeting.css';

// 🎇 Firework with Instancing
const Fireworks = () => {
  const instRef = useRef();
  const count = 340;
  const dummy = new THREE.Object3D();
  const clock = new THREE.Clock();

  const speeds = Array.from({ length: count }, () =>
    new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 2,
      (Math.random() - 0.5) * 2
    )
  );

  useFrame(() => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const s = speeds[i];
      dummy.position.set(s.x * t, s.y * t - 2, s.z * t);
      dummy.scale.setScalar(1 - t / 3);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);
    }
    instRef.current.instanceMatrix.needsUpdate = true;
    if (t > 3) clock.start(); // Reset fireworks every 3s
  });

  return (
    <instancedMesh ref={instRef} args={[null, null, count]}>
      <sphereGeometry args={[0.019, 5, 9]} />
      <meshBasicMaterial color="white" transparent opacity={0.8} />
    </instancedMesh>
  );
};

// 🎈 Realistic balloon with string
const Balloon = ({ position }) => {
  const group = useRef();
  const curveRef = useRef();
  const [timeOffset] = useState(Math.random() * 100);
  const stringPoints = useRef([]);

  const radius = 0.5 + Math.random() * 0.3;
  const height = 0.7 + Math.random() * 0.2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + timeOffset;
    const floatY = Math.sin(t * 0.8) * 0.2;
    group.current.position.y = floatY;

    // update dynamic string curve
    const baseY = -height;
    stringPoints.current = [
      new THREE.Vector3(0, baseY, 0),
      new THREE.Vector3(0.05 * Math.sin(t * 2), baseY - 0.4, 0.02),
      new THREE.Vector3(0.03 * Math.cos(t * 1.5), baseY - 0.8, -0.02),
      new THREE.Vector3(0, baseY - 1.5, 0),
    ];
    curveRef.current.geometry.setFromPoints(new THREE.CatmullRomCurve3(stringPoints.current).getPoints(20));
  });

  return (
    <group ref={group} position={position}>
      {/* Ellipsoid balloon shape */}
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshPhysicalMaterial
          transmission={1}
          
          thickness={1}
          clearcoat={1}
          clearcoatRoughness={0.8}
          reflectivity={1}
          envMapIntensity={1}
          color="#a6a6a6"
          roughness={0} 
          metalness={0.4}
          
        />
      </mesh>

      {/* Curved string */}
      <line ref={curveRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#aaa" />
      </line>
    </group>
  );
};

// 🎈 Generate multiple balloons
const Balloons = () => {
  const [positions] = useState(() => {
    const result = [];
    const count = 7 + Math.floor(Math.random() * 5); // 8–12 balloons
    const minDistance = 1.4; // minimum distance between balloons

    let attempts = 0;
    while (result.length < count && attempts < count * 30) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        -2 + Math.random() * 1,
        (Math.random() - 0.5) * 2
      );

      // Check if too close to existing balloons
      if (
        result.every((existing) => existing.distanceTo(pos) >= minDistance)
      ) {
        result.push(pos);
      }
      attempts++;
    }

    return result;
  });

  return (
    <>
      {positions.map((pos, i) => (
        <Balloon key={i} position={pos.toArray()} />
      ))}
    </>
  );
};

// 🌌 Scene with lights, environment, balloons and fireworks
const Scene = () => (
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 5, 2]} intensity={1.5} color="#ffffff" />
          
    <Balloons />
    <Fireworks />
    <Suspense fallback={null}>

      <Environment preset="studio"  backgroundIntensity={1} rotation={[0, Math.PI / 2, 0]}/>
    </Suspense>
    <OrbitControls/>
  </>
);

// 🎉 Main Greeting UI
const Greeting = ({ name, age, message, onBack, sharedMode = false }) => {
  const [showText, setShowText] = useState(false);
  const letters = `Happy ${age}th Birthday, ${name}!`.split('');

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="after-blow">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 6], fov: 40 }}
        style={{background: "#909090"}}
        >
          <Scene />
        </Canvas>
      </div>

      {showText && (
        <div className="text-overlay">
          <h2 className="birthday-text">
            {letters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 80 }}
              >
                {char}
              </motion.span>
            ))}
          </h2>
          <motion.p
            className="message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {message}
          </motion.p>
          {!sharedMode && (
            <motion.button
              className="back-btn"
              onClick={onBack}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              🔁 Create Another
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default Greeting;

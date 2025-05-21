import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// Yksittäinen planeetta, joka pyörii ja kiertää keskustaa
function OrbitingPlanet({ radius, speed, texture, initialAngle, size }) {
  const ref = useRef();
  const angleRef = useRef(initialAngle);

  useFrame(() => {
    angleRef.current += speed;
    const angle = angleRef.current;

    // Kiertoradan uusi sijainti
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    if (ref.current) {
      ref.current.position.set(x, 0, z);
      ref.current.rotation.y += 0.002; // oman akselin pyöriminen
    }
  });

  return (
    <mesh ref={ref} scale={size}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function PlanetField({ emotion = 'neutral' }) {
  const texture = useLoader(TextureLoader, `/pic/${emotion}.png`);

  const planets = useMemo(() => {
    const count = Math.floor(Math.random() * 6) + 1;
    return Array.from({ length: count }, () => {
      const radius = Math.random() * 2 + 1.5;        // etäisyys keskustasta
      const speed = 0.001 + Math.random() * 0.001;   // kiertonopeus
      const size = Math.random() * 0.25 + 0.05;      // koko
      const initialAngle = Math.random() * Math.PI * 2;
      return { radius, speed, size, initialAngle };
    });
  }, [emotion]);



  return (
    <>
      {planets.map((p, i) => (
        <OrbitingPlanet
          key={i}
          radius={p.radius}
          speed={p.speed}
          size={p.size}
          initialAngle={p.initialAngle}
          texture={texture}
        />
      ))}
    </>
  );
}

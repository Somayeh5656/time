import React, { useRef, useEffect, useState } from 'react'; 
import { useFrame } from '@react-three/fiber';

const Candle = ({ position, isBlownOut, blowForce = 0 }) => {
  const flameRef = useRef();
  const timeRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);

  useFrame((state, delta) => {
    timeRef.current += delta;

    // Liekin voimakas heilunta puhalluksen mukaan
    // blowForce voi olla esimerkiksi 0..1, kerrotaan vahvuus
    // Liekin X-paikan heilahdus lisääntyy blowForce mukaan

    const baseSway = Math.sin(timeRef.current * 15) * 0.09; // nopea, pieni pohja-heila
    const blowSway = blowForce * Math.sin(timeRef.current * 60) * 30; // nopea, voimakas puhallusheila

    const totalX = baseSway + blowSway;
    setOffsetX(totalX);

    if (flameRef.current) {
      flameRef.current.position.set(totalX, 9 + Math.sin(timeRef.current * 20) * 0.8, 0);
      flameRef.current.scale.y = 9 + Math.sin(timeRef.current * 18) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Kynttilän runko, kapeneva sylinteri */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.07, 0.9, 32]} />
        <meshStandardMaterial color="pink" />
      </mesh>

      {!isBlownOut && (
        <>
          {/* Liekin valo */}
          <pointLight position={[offsetX, 0.85, 0]} intensity={1.5} color="#ff6600" distance={1.4} />
          <pointLight position={[offsetX, 1.05, 0]} intensity={4} color="#ffdd55" distance={1.4} />

          {/* Liekin alaosa oranssina */}
          <mesh position={[0, 1, 0]} scale={[1, 0.5, 1]} >
            <coneGeometry args={[0.025, 0.08, 46]} />
            <meshPhysicalMaterial
              emissive="#ff6833"
              emissiveIntensity={9}
              transmission={1}
              roughness={0.1}
              thickness={1}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Liekin keskiosa, jossa liukuväri oranssista keltaiseen */}
          <mesh ref={flameRef} position={[offsetX, 0.93, 0]} scale={[1, 1.6, 1]}>
            <coneGeometry args={[0.04, 0.14, 16]} />
            <meshPhysicalMaterial
              emissive="#ff8b33"
              emissiveIntensity={12}
              transmission={1}
              roughness={0.2}
              thickness={1}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Liekin yläosa keltaisena */}
          <mesh position={[offsetX, 1.06, 0]} scale={[0.6, 0.4, 0.6]}>
            <coneGeometry args={[0.03, 0.1, 16]} />
            <meshPhysicalMaterial
              emissive="orange"
              emissiveIntensity={7}
              transmission={1}
              roughness={0.3}
              thickness={1}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Hehkuva halo liekin ympärillä */}
          <mesh position={[offsetX, 0.95, 0]}>
            <coneGeometry args={[0.07, 0.18, 16]} />
            <meshStandardMaterial
              emissive="orange"
              transparent
              opacity={0.28}
              roughness={0.2}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Candle;

import React, { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';
import Candle from './candle';

const CakeWithCandle = ({ blownOut ,blowForce}) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
    }
  });

  const bowTexture = useLoader(TextureLoader, '/pic/Bows.jpg');
  bowTexture.wrapS = RepeatWrapping;
  bowTexture.repeat.set(9, 1);


  const height = 0.5;

  // Materiaalit ylin ja alin kerros
  const sideMaterialWithBow = (
    <meshStandardMaterial
      attach="material-0"
      map={bowTexture}
      roughness={0.9}
      metalness={0.01}
    />
  );
  const topMaterialPlain = (
    <meshStandardMaterial
      attach="material-1"
      color="#fff"  // pohjan väri, valkoinen
      roughness={0.4}
      metalness={0.1}
    />
  );
  const bottomMaterialPlain = (
    <meshStandardMaterial
      attach="material-2"
      color="#fff"
      roughness={0.4}
      metalness={0.1}
    />
  );

  return (
    <group ref={groupRef}>
      {/* 🔻 Alin kerros (bow texture sivuilla, pohjat yksiväriset) */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, height, 64]} />
        {[sideMaterialWithBow, topMaterialPlain, bottomMaterialPlain]}
      </mesh>

      {/* ⚪ Keskimmäinen kerros (vain väri) */}
      <mesh position={[0, height * 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, height, 64]} />
        <meshStandardMaterial
          color="#ffd1dc"
          roughness={0.6}
          metalness={0.1}
 
          
          
        />
      </mesh>

      {/* 🔺 Ylin kerros (bow texture sivuilla, pohjat yksiväriset) */}
      <mesh position={[0, height * 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, height, 64]} />
        {[sideMaterialWithBow, topMaterialPlain, bottomMaterialPlain]}
      </mesh>
  

      {/* 🕯️ Kynttilät */}
      <Candle position={[-0.25, height * 3.2 + 0.2, 0]} isBlownOut={blownOut} blowForce={blowForce} />
      <Candle position={[0, height * 3.2 + 0.2, 0]} isBlownOut={blownOut} blowForce={blowForce} />
      <Candle position={[0.25, height * 3.2 + 0.2, 0]} isBlownOut={blownOut} blowForce={blowForce} />
    </group>
  );
};

export default CakeWithCandle;

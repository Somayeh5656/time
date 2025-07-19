import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Candle from './candle';

const CakeWithCandle = ({ blownOut }) => {
  return (
    <group>
      {/* Base layer */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2, 2, 0.6, 32]} />
        <meshStandardMaterial color="#ffc0cb" />
      </mesh>
      {/* Middle layer */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
        <meshStandardMaterial color="#fbaed2" />
      </mesh>
      {/* Top layer */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[1, 1, 0.4, 32]} />
        <meshStandardMaterial color="#f0a1c8" />
      </mesh>

      {/* 3 candles */}
      <Candle position={[-0.4, 1.9, 0]} isBlownOut={blownOut} />
      <Candle position={[0, 1.9, 0]} isBlownOut={blownOut} />
      <Candle position={[0.4, 1.9, 0]} isBlownOut={blownOut} />
    </group>
  );
};

export default CakeWithCandle;

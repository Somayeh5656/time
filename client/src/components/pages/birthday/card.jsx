import React, { useEffect } from 'react';
import './card.css';
import { Canvas } from '@react-three/fiber';
import CakeWithCandle from './cakeWithCandles';
import { OrbitControls } from '@react-three/drei';

const Card = ({ name, age, message, onBlow, blownOut = false }) => {
  useEffect(() => {
    if (blownOut) return; // Jaettu näkymä, ei puhallusta

    // 🎤 Mikrofoniäänitason mittaus
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const detect = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b) / data.length;
        if (avg > 90) onBlow?.(); // Herkkä puhalluksen tunnistus
        else requestAnimationFrame(detect);
      };
      source.connect(analyser);
      detect();
    }).catch((err) => {
      console.warn('Mikrofonin käyttö estetty:', err);
    });
  }, [onBlow, blownOut]);

  return (
    <div className="birthday-card">
      <h1>Make a wish and blow the candles, {name}!</h1>
      <Canvas
      style={{ height: '400px' }}
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[9, 0, 0]} castShadow intensity={1} />
      <OrbitControls />
      <CakeWithCandle blownOut={blownOut} />
    </Canvas>
    </div>
  );
};

export default Card;

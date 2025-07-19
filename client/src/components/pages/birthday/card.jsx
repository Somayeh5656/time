import React, { useEffect } from 'react';
import './card.css';
import { Canvas } from '@react-three/fiber';
import CakeWithCandle from './cakeWithCandles';


const Card = ({ name, age, message, onBlow, blownOut = false }) => {
  useEffect(() => {
    if (blownOut) return; // Jos jaettu näkymä, ei toisteta audioa tai puhallusta

    const audio = new Audio('/audio/happy-birthday-to-you.mp3');
    audio.play();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const detect = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b) / data.length;
        if (avg > 90) onBlow?.(); // Tee puhalluksesta herkempi
        else requestAnimationFrame(detect);
      };
      source.connect(analyser);
      detect();
    });
  }, [onBlow, blownOut]);

  return (
    <div className="birthday-card">
      <h1>Make a wish and blow the candles, {name}!</h1>
      <Canvas style={{ height: '400px' }}>
        <ambientLight />
        <pointLight position={[0, 5, 5]} />
        <CakeWithCandle blownOut={blownOut} />
      </Canvas>
    </div>
  );
};

export default Card;
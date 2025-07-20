import React, { useEffect, useState, useRef } from 'react';
import './card.css';
import { Canvas } from '@react-three/fiber';
import CakeWithCandle from './cakeWithCandles';
import { OrbitControls } from '@react-three/drei';

const Card = ({ name, age, message, onBlow, blownOut = false }) => {
  const [blowForce, setBlowForce] = useState(0);
  const hasBlownOut = useRef(false);

  useEffect(() => {
    if (blownOut) {
      hasBlownOut.current = true; // merkkaa, että kynttilä on sammutettu
      return; // ei kuunnella enää mikrofonia
    } else {
      hasBlownOut.current = false; // resetoi tilan, jos kynttilä on sytytetty uudelleen
    }

    let animationFrameId;
    let audioCtx;
    let source;
    let analyser;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;

      const data = new Uint8Array(analyser.frequencyBinCount);

      const detect = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;

        // Skaalaa voimakkuus välillä 0..1 (esim. 40–100)
        let force = Math.min(1, Math.max(0, (avg - 40) / 60));
        setBlowForce(force);

        // Kutsu onBlow vain kerran, kun blowForce ylittää 0.6
        if (force > 0.6 && !hasBlownOut.current) {
          hasBlownOut.current = true;
          onBlow?.();
        }

        animationFrameId = requestAnimationFrame(detect);
      };

      source.connect(analyser);
      detect();
    }).catch((err) => {
      console.warn('Mikrofonin käyttö estetty:', err);
    });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioCtx) audioCtx.close();
    };
  }, [onBlow, blownOut]);

  return (
    <div className="birthday-card">
      <h1>Make a wish and blow the candles, {name}!</h1>
      <Canvas
        style={{ height: '400px' }}
        shadows
        camera={{ position: [4, 4, 4], fov: 50 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[9, 5, 5]} castShadow intensity={1} />
        <OrbitControls />
        <CakeWithCandle blownOut={blownOut} blowForce={blowForce} />
      </Canvas>
    </div>
  );
};

export default Card;

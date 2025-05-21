import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import StarDust from "./starDust";
import { IoIosArrowBack } from "react-icons/io";
import "./feelings.css";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import PlanetField from "./planetField";
import DescribeImpact from "./describeImpact";
import { useNavigate } from "react-router-dom";



const emotions = ["fear", "anger", "neutral", "joy", "sadness"];
const emotionTimes = {
  neutral: [3.35],
  joy: [52.77],
  sadness: [208.25],
  fear: [45.50],
  anger: [169.201],
};

const Feelings = ({ onClose }) => {
  const [emotion, setEmotion] = useState("neutral");
  const [showDescribeImpact, setShowDescribeImpact] = useState(false);
  const audioRef = useRef(null);
  const navigate= useNavigate();

  // Play background music
  useEffect(() => {
    const audio = new Audio("/audio/insideOut.mp3");
    audio.loop = true;
    audioRef.current = audio;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Scroll handling
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Update music time based on emotion
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = emotionTimes[emotion] || 0;
    }
  }, [emotion]);

  return (
    <div className="feeling-container">
      {showDescribeImpact ? (
        <DescribeImpact
          emotion={emotion}
          onBack={() => setShowDescribeImpact(false)}
        />
      ) : (
        <>
          {/* Back Button */}
          <div className="back-button">
            <IoIosArrowBack onClick={()=>navigate("/")} />
          </div>

          {/* 3D Galaxy Marble */}
          <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 3], fov: 90 }}>
              <ambientLight intensity={2} />
              <PlanetField emotion={emotion} />
              <StarDust emotion={emotion} />
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  intensity={1.5}
                />
                <Vignette eskil={false} offset={0.2} darkness={1.2} />
              </EffectComposer>
              <OrbitControls />
            </Canvas>
          </div>

          {/* Emotion Label */}
          <div className={`emotion-label active ${emotion}`}>
            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </div>

          {/* Slider */}
          <input
            className={`emotion-slider ${emotion}`}
            type="range"
            min="0"
            max={emotions.length - 1}
            step="1"
            value={emotions.indexOf(emotion)}
            onChange={(e) => setEmotion(emotions[Math.round(e.target.value)])}
          />

          {/* Next Button */}
          <button
            className={`next-button ${emotion}`}
            onClick={() => setShowDescribeImpact(true)}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default Feelings;

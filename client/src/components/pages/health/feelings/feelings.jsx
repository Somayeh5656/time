import react, { useEffect,useState, useRef } from "react";
import {IoIosArrowBack} from "react-icons/io";
import StarDust from "./starDust"
import PlanetField from "./planetField"
import { OrbitControls } from "@react-three/drei";
import "./feelings.css";
import {Canvas} from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

const emotions=["fear","anger","neutral","joy","sadness"]

const emotionTimes={
  neutral:[3.35],
  joy:[52.77],
  sadness:[208.25],
  fear:[45.50],
  anger:[169.201],
}

const Feelings=({onBack, onSelectEmotion})=> {
  const [emotion,setEmotion]= useState("neutral");
  const audioRef=useRef(null);

  useEffect(()=>{
    const audio=new Audio("/audio/insideOut.mp3");
    audio.loop= true;
    audioRef.current=audio;
    audio.play();

    return()=>{
      audio.pause();
      audio.currentTime=0;
    };
  },[])

  useEffect(()=>{
    if(audioRef.current){
      audioRef.current.currentTime= emotionTimes[emotion] || 0;

    }
  },[emotion]);

  return (
    <div className="feeling-container">
      <div className="back-button"
      onClick={onBack}
      >
        <IoIosArrowBack />

      </div>
      <div className="canvas-container">
        <Canvas camera={{position:[0,0,3], fov:90}}>
          <ambientLight intensity={2} />
          <StarDust emotion={emotion}/>
          <PlanetField emotion={emotion} />
          <OrbitControls /> 

          <EffectComposer>
            <Bloom
            luminanceThreshold={0.9}
            luminnanceSmoothing={0.9}
            intensity={2}

            />
            <Vignette
             eskil={false} offset={0.2} darkness={1.1}
            />
          </EffectComposer>
 


        </Canvas>

      </div>
      <div className={`emotion-label active ${emotion}`}>
        {emotion.charAt(0).toUpperCase()+ emotion.slice(1)}
        
      </div>
      <input className={`emotion-slider ${emotion}`}
      type="range"
      min="0"
      max={emotions.length-1}
      step="1"
      value={emotions.indexOf(emotion)}
      onChange={(e)=>{ setEmotion(emotions[Math.round(e.target.value)])}}

      
      />

      <button className={`next-button ${emotion}`}
      onClick={()=>{onSelectEmotion(emotion)}}
      >
        Next
      </button>
    </div>
   
  )




}

export default Feelings;
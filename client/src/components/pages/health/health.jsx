import React , {useState, useEffect,useRef} from "react";
import "./health.css"
import { RiMentalHealthLine } from "react-icons/ri";
import { MdOutlineCleanHands } from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";
import { GrCycle } from "react-icons/gr";
import { IoIosArrowForward } from "react-icons/io";
import Feelings from "./feelings/feelings";
import Acne from "./acne";



const Health = ()=>{
    const [selected, setSelected]= useState(null);
    const audioRef= useRef(null);
   
    useEffect(()=>{
        const audio= new Audio("/audio/.mp3")
        audio.preload="auto";

        audio.loop=true;
        audio.play();

        audioRef.current=audio;

        return ()=> audio.pause();
    },[])

    useEffect(()=>{
        if(selected&& audioRef.current){
            audioRef.current.pause();

        }
    },[selected])

    return (

        <div className="health-container">
           
                <div className="feelings" onClick={()=>(setSelected("feelings"))}>
                    <div className="left-header">
                        <RiMentalHealthLine />
                        <h2 className="feelings-header">Feelings</h2>
                    </div>
                    <IoIosArrowForward />
                
                </div>

            
{/*
                <div className="acne" onClick={()=>setSelected("acne")}>
                    <div className="left-header">
                        <MdOutlineCleanHands />
                        <h2 className="acne-header">Acne</h2>
                    </div>
                    <IoIosArrowForward />
                    
                </div>

*/ }



            


            <div className="health-subview">
                
                {selected==="feelings" && <Feelings onClose={()=>setSelected(null)} />}
               
                {selected==="acne" && <Acne/>}
                
               
            </div>    

        </div>
        

    );
};

export default Health;
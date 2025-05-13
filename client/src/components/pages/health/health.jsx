import React , {useState, useEffect,useRef} from "react";
import "./health.css"
import { RiMentalHealthLine } from "react-icons/ri";
import { MdOutlineCleanHands } from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";
import { GrCycle } from "react-icons/gr";
import { IoIosArrowForward } from "react-icons/io";
import Feelings from "./feelings";
import Diary from "./diary";
import Acne from "./acne";
import Period from "./period";





const Health = ()=>{
    const [selected, setSelected]= useState(null);
   
    useEffect(()=>{
        const audio= new Audio("/audio/laPetiteFilleDeLaMer.mp3")
        audio.preload="auto";

        audio.loop=true;
        audio.play();
        return ()=> audio.pause();
    },[])

    return (

        <div className="health-container">
           
                <div className="feelings" onClick={()=> setSelected("feelings")}>
                    <div className="left-header">
                        <RiMentalHealthLine />
                        <h2 className="feelings-header">Feelings</h2>
                    </div>
                    <IoIosArrowForward />
                
                </div>

                <div className="diary" onClick={()=> setSelected("diary")}>
                     <div className="left-header">
                        <LuNotebookPen />
                        <h2 className="diary-header">Diary</h2>
                    </div>
                    <IoIosArrowForward />
                    
                </div>

                <div className="acne" onClick={()=> setSelected("acne")}>
                    <div className="left-header">
                        <MdOutlineCleanHands />
                        <h2 className="acne-header">Acne</h2>
                    </div>
                    <IoIosArrowForward />
                    
                </div>

                <div className="period" onClick={()=> setSelected("period")}>
                    <div className="left-header">
                        <GrCycle />
                        <h2 className="period-header">Period</h2>
                    </div>
                    <IoIosArrowForward />
                    
                
            </div>

            <div className="health-subview">
                {selected==="feelings"&& <Feelings />}
                {selected==="diary"&& <Diary />}
                {selected==="acne"&& <Acne />}
                {selected==="period"&& <Period />}

            </div>

            

        </div>
        

    );
};

export default Health;
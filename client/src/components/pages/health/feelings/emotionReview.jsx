import React, { useState,useEffect} from "react";
import Feelings from "./feelings";
import DescribeImpact from "./describeImpact";
import "./emotionReview.css";
import axios from "../../../../utils/axios"
import { RiDeleteBin6Line } from "react-icons/ri";


const EmotionReview = () => {
  const [logs, setLogs] = useState([]);
  const [step, setStep] = useState("review"); // review, feelings, describe
  const [emotion, setEmotion] = useState(null);
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [selectedImpacts, setSelectedImpacts] = useState([]);

useEffect(()=>{
    const fetchLogs=async()=>{
        const token= localStorage.getItem("token");
        if(!token) return;

        try{
            const response= await axios.get("/emotions", {
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            })
            setLogs(response.data);

        }catch(e){
            console.log("Failed to fetch emotion logs:", e)

        }


    }
    fetchLogs();
},[])


  const resetFlow = () => {
    setStep("review");
    setEmotion(null);
    setSelectedFeelings([]);
    setSelectedImpacts([]);
  };

  const addLog = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const now = new Date();
    const newLog = {
      emotion,
      feelings: selectedFeelings,
      impacts: selectedImpacts,
      timestamp: now.toISOString(),
    };
    console.log("newlog",newLog)

    try {
      const res=await axios.post("/emotions", newLog, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs([res.data, ...logs]);
    } catch (e) {
      console.error("Failed to add emotion", e);
    }

    resetFlow();
  };


  const handleDelete = async (logId) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await axios.delete(`/emotions/${logId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Poista loki front-endistä
    setLogs((prevLogs) => prevLogs.filter((log) => log._id !== logId));
  } catch (e) {
    console.error("Failed to delete log:", e);
  }
};


  if (step === "feelings") {
    return (
      <Feelings
        onSelectEmotion={(selected) => {
          setEmotion(selected);
          setStep("describe");
        }}
        onBack={resetFlow}
      />
    );
  }

  if (step === "describe") {
    return (
      <DescribeImpact
        emotion={emotion}
        onBack={() => setStep("feelings")}
        resetFlow={resetFlow}
        selectedFeelings={selectedFeelings}
        setSelectedFeelings={setSelectedFeelings}
        selectedImpacts={selectedImpacts}
        setSelectedImpacts={setSelectedImpacts}
        onDone={addLog}
      />
    );
  }

  return (
    <div className="emotion-review">
      <div className="emotion-review-header">
        <h2>Logged Emotions</h2>
        <button onClick={() => setStep("feelings")} className="log-new-button">
          Log New Feeling
        </button>
      </div>

      {logs.length === 0 ? (
        <p className="no-entries">No entry</p>
      ) : (
        <ul className="log-list">
          {logs.map((log) => (
            <li key={log._id} className="log-item">
                <div className="log-header">
                    <div><strong>{log.emotion}</strong></div>
                <span onClick={()=>{
                    if(window.confirm("Are you sure you want to delete this log?")){
                     handleDelete(log._id)}}    
                    }
                    className="delete-log"
                    >
                 < RiDeleteBin6Line/>
                </span>
                </div>
              
              <div className="log-meta">

                <div className="log-tags">
                  {log.feelings.map((f) => (
                    <span key={f} className="tag">{f}</span>
                  ))}
                  {log.impacts.map((i) => (
                    <span key={i} className="tag impact">{i}</span>
                  ))}

                
                </div>
                <span>
                  {new Date(log.timestamp).toLocaleString(undefined, {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    })}
                </span>
                

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmotionReview;
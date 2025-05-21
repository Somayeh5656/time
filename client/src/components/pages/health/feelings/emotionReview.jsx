import React from "react";
import "./emotionReview.css";

const EmotionReview = ({ emotion, feelings, impacts, timestamp, onBack, done }) => {
  return (
    <div className="review-container">

        <div className="review-header">
            <span onClick={onBack}>Back</span>
            {timestamp && (
            <div className="timestamp">
            {new Date(timestamp).toLocaleDateString()}{" "}
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
        )}
            <span onClick={done}>Done</span>
            
        </div>
        <h1 className={`emotion-name ${emotion}`}>{emotion }</h1>

        <div className="review-content">
            <h2 className="feeling-header">Feelings</h2>
            <div className="feeling-grid">
            {feelings.map((feeling, idx) => (
                <div key={idx} className= {`feeling-item emotion-name ${emotion}`}>{feeling}</div>
            ))}
            </div>

            <h2 className="impact-header">Impacts</h2>
            <div className="impact-grid">
            {impacts.map((impact, idx) => (
                <div key={idx} className={`impact-item emotion-name ${emotion}`}>{impact}</div>
            ))}
            </div>


            
        </div>
        

      
    </div>
  );
};

export default EmotionReview;

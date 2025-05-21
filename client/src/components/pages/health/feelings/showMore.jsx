import React from "react";
import "./showMore.css";

const ShowMore = ({ allFeelings, selectedFeelings, toggleFeeling, onDone }) => {
  return (
    <div className="expanded-feeling-list">
      <div className="show-more-header">
        <span className="cancel-text" onClick={onDone}>Cancel</span>
        <span className="done-button" onClick={onDone}>Done</span>
      </div>

      <span className="show-more-question">What best describes this feeling?</span>
      <div className="feeling-list-vertical">
        {allFeelings.map((feeling) => {
          const isSelected = selectedFeelings.includes(feeling);
          return (
            <div
              key={feeling}
              className={`feeling-row ${isSelected ? "selected" : ""}`}
              onClick={() => toggleFeeling(feeling)}
            >
              <div className={`circle ${isSelected ? "filled" : ""}`} />
              <span className="feeling-text">{feeling}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShowMore;

import React, { useState } from "react";
import ShowMore from "./showMore";
import "./describeImpact.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const emotionFeelingMap = {
  fear: ["Anxious", "Insecure", "Terrified", "Nervous", "Worried"],
  anger: ["Frustrated", "Irritated", "Enraged", "Annoyed", "Resentful"],
  neutral: ["Content", "Calm", "Peaceful", "Indifferent", "Tired"],
  joy: ["Excited", "Grateful", "Proud", "Cheerful", "Energetic"],
  sadness: ["Lonely", "Depressed", "Disappointed", "Hopeless", "Down"],
};

const impactOptions = [
  "Health", "Fitness", "Self-Care", "Hobbies", "Identity", "Spirituality",
  "Family", "Friends", "Partner", "Dating", "Community", "Loneliness",
  "Tasks", "Work", "School", "Finances", "Current Events", "Money",
];

const allFeelings = [...new Set(Object.values(emotionFeelingMap).flat())];

const DescribeImpact = ({
  emotion,
  onBack,
  resetFlow,
  selectedFeelings,
  setSelectedFeelings,
  selectedImpacts,
  setSelectedImpacts,
  onDone,
}) => {
  const [showMore, setShowMore] = useState(false);

  const toggleFeeling = (feeling) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling]
    );
  };

  const toggleImpact = (impact) => {
    setSelectedImpacts((prev) =>
      prev.includes(impact)
        ? prev.filter((i) => i !== impact)
        : [...prev, impact]
    );
  };

  const emotionFeelings = emotionFeelingMap[emotion] || [];

  if (showMore) {
    return (
      <ShowMore
        allFeelings={allFeelings}
        selectedFeelings={selectedFeelings}
        toggleFeeling={toggleFeeling}
        onDone={() => setShowMore(false)}
      />
    );
  }

  return (
    <div className="describe-impact-container">
      <div className="header">
        <span onClick={onBack} className="back-header">
          <span className="back-icon"><IoIosArrowBack /></span>
          Emotion
        </span>
      </div>

      <h2 className={`emotion-name ${emotion}`}>
        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
      </h2>
      <p>What best describes this feeling?</p>

      <div className="feeling-tags">
        {emotionFeelings.map((feeling) => (
          <button
            key={feeling}
            onClick={() => toggleFeeling(feeling)}
            className={`tag-button ${selectedFeelings.includes(feeling) ? "active" : ""}`}
          >
            {feeling}
          </button>
        ))}
      </div>

      <div className="header show-more-header">
        <span className="show-more-text" onClick={() => setShowMore(true)}>
          Show More
          <span className="show-more-icon"><IoIosArrowForward /></span>
        </span>
      </div>

      <p className="impact-question">What’s having the biggest impact on you?</p>

      <div className="impact-tags">
        {impactOptions.map((impact) => (
          <button
            key={impact}
            onClick={() => toggleImpact(impact)}
            className={`tag-button ${selectedImpacts.includes(impact) ? "active" : ""}`}
          >
            {impact}
          </button>
        ))}
      </div>

      <div className="next-footer">
        <button
          onClick={onDone}
          className={`describe-impact-next-button ${emotion}`}
          disabled={selectedFeelings.length === 0 && selectedImpacts.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DescribeImpact;

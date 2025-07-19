import React from 'react';
import "./greeting.css";

const Greeting = ({ name, age, message, onBack }) => {
  return (
    <div className="after-blow">
      <h2>🎉 Happy {age}th Birthday, {name}!</h2>
      <p>{message}</p>
      <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
        🎁 Share this greeting
      </button>
      <br />
      <button onClick={onBack}>🔁 Create Another</button>
    </div>
  );
};

export default Greeting;

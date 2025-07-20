import React from 'react';
import "./greeting.css";

const Greeting = ({ name, age, message, onBack, sharedMode = false }) => {
  return (
    <div className="after-blow">
      <h2>🎉 Happy {age}th Birthday, {name}!</h2>
      <p>{message}</p>

      <br />
      {!sharedMode && ( // Näytetään nappi vain jos EI jaetussa tilassa
        <button onClick={onBack}>🔁 Create Another</button>
      )}
    </div>
  );
};

export default Greeting;

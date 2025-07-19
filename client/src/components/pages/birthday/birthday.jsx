import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from './card';
import Greeting from './greeting';
import './birthday.css';

const Birthday = () => {
  const [view, setView] = useState('form'); // 'form' | 'card' | 'greeting'
  const [formData, setFormData] = useState({ name: '', age: '', message: '' });
  const [searchParams] = useSearchParams();

  // Tarkista URL-parametrit
  useEffect(() => {
    const name = searchParams.get('name');
    const age = searchParams.get('age');
    const message = searchParams.get('message');
    if (name && age && message) {
      setFormData({ name, age, message });
      setView('shared'); // erityistila jaetulle linkille
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, age, message } = formData;
    if (!name || !age || !message) return;
    setView('card');
  };

  const generateLink = () => {
    const params = new URLSearchParams(formData).toString();
    const url = `${window.location.origin}/?${params}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  // 🔁 Shared näkymä – ei nappeja
  if (view === 'shared') {
    return (
      <>
        <Card {...formData} blownOut={true} />
        <Greeting {...formData} />
      </>
    );
  }

  if (view === 'card') {
    return (
      <Card
        {...formData}
        blownOut={false}
        onBlow={() => setView('greeting')}
      />
    );
  }

  if (view === 'greeting') {
    return (
      <Greeting
        {...formData}
        onBack={() => setView('form')}
      />
    );
  }

  return (
    <div className="birthday">
      <h2>🎉 Create Birthday Surprise</h2>
      <form onSubmit={handleSubmit} className="birthday-form">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Greeting message"
          value={formData.message}
          onChange={handleChange}
        />
        <button type="submit">Show the Demo</button>
        {view !== 'card' && (
          <button type="button" onClick={generateLink}>📨 Share the Greeting</button>
        )}
      </form>
    </div>
  );
};

export default Birthday;

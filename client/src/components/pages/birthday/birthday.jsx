import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from './card';
import Greeting from './greeting';
import './birthday.css';

const Birthday = () => {
  const [view, setView] = useState('form'); // form | video | card | greeting
  const [formData, setFormData] = useState({ name: '', age: '', message: '' });
  const [searchParams] = useSearchParams();
  const [isShared, setIsShared] = useState(false); // jos avattu jaetulla linkillä
  const [hasInteracted, setHasInteracted] = useState(false); // videon jälkeen tai napin painallus
  const cakeAudioRef = useRef(null);
  const greetingAudioRef = useRef(null);

  // 🎯 Tarkista jaettu linkki
  useEffect(() => {
    const name = searchParams.get('name');
    const age = searchParams.get('age');
    const message = searchParams.get('message');
    if (name && age && message) {
      setFormData({ name, age, message });
      setIsShared(true);
      setView('video'); // Aloita videolla myös jaetussa näkymässä
    }
  }, [searchParams]);

  // 🔊 Audiohallinta näkymän mukaan
  useEffect(() => {
    // Sammuta kaikki musiikit ensin
    cakeAudioRef.current?.pause();
    greetingAudioRef.current?.pause();

    if (view === 'card') {
      if (!cakeAudioRef.current) {
        const audio = new Audio('/audio/happy-birthday-to-you.mp3');
        audio.loop = true;
        audio.play().catch(console.warn);
        cakeAudioRef.current = audio;
      } else {
        cakeAudioRef.current.play().catch(console.warn);
      }
    }

    if (view === 'greeting') {
      if (!greetingAudioRef.current) {
        const audio = new Audio('/audio/happy-birthday-laura.mp3');
        audio.loop = true;
        audio.play().catch(console.warn);
        greetingAudioRef.current = audio;
      } else {
        greetingAudioRef.current.play().catch(console.warn);
      }
    }

    return () => {
      cakeAudioRef.current?.pause();
      greetingAudioRef.current?.pause();
    };
  }, [view]);

  // ✅ Lomakkeen kentät
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 📝 Lomake lähetetty
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, age, message } = formData;
    if (!name || !age || !message) return;
    setIsShared(false); // ei jaettu linkki
    setHasInteracted(false); // näytetään video
    setView('video');
  };

  // 🔗 Luo ja kopioi linkki
  const generateLink = () => {
    const params = new URLSearchParams(formData).toString();
    const url = `${window.location.origin}/birthday?${params}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  // 🎥 Videonäkymä
  if (view === 'video' && !hasInteracted) {
    return (
      <div className="start-overlay">
        <video
          src="/audio/doodles.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => {
            setHasInteracted(true);
            setView('card');
          }}
          className="intro-video"
        />
        <button
          className="start-btn"
          onClick={() => {
            setHasInteracted(true);
            setView('card');
          }}
        >
          🎁 Katso, mitä toin sinulle!
        </button>
      </div>
    );
  }

  // 🎂 Kakku
  if (view === 'card') {
    return (
      <Card
        {...formData}
        blownOut={false}
        onBlow={() => {
          cakeAudioRef.current?.pause();
          setView('greeting');
        }}
      />
    );
  }

  // 🎉 Tervehdys
  if (view === 'greeting') {
    return (
      <Greeting
        {...formData}
        sharedMode={isShared}
        onBack={() => {
          setIsShared(false);
          setView('form');
        }}
      />
    );
  }

  // 📝 Lomake
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
        <button type="submit">🎂 Show the Cake</button>
        <button type="button" onClick={generateLink}>📨 Share the Greeting</button>
      </form>
    </div>
  );
};

export default Birthday;import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from './card';
import Greeting from './greeting';
import './birthday.css';

const Birthday = () => {
  const [view, setView] = useState('form'); // 'form' | 'card' | 'greeting'
  const [formData, setFormData] = useState({ name: '', age: '', message: '' });
  const [searchParams] = useSearchParams();
  const [isShared, setIsShared] = useState(false); // onko avattu jaetun linkin kautta
  const audioRef = useRef(null);

  // ⏺️ Tarkista URL-parametrit, jos tullaan jaetulla linkillä
  useEffect(() => {
    const name = searchParams.get('name');
    const age = searchParams.get('age');
    const message = searchParams.get('message');
    if (name && age && message) {
      setFormData({ name, age, message });
      setIsShared(true);
      setView('card'); // näytetään kakku heti
    }
  }, [searchParams]);

  // 🔊 Toista synttäribiisi, kun ei olla form-näkymässä
  useEffect(() => {
    if (view !== 'form') {
      if (!audioRef.current) {
        const audio = new Audio('/audio/happy-birthday-to-you.mp3');
        audio.loop = true;
        audio.play().catch(err => {
          console.warn('Autoplay estetty:', err);
        });
        audioRef.current = audio;
      } else {
        audioRef.current.play();
      }
    } else {
      audioRef.current?.pause();
      audioRef.current = null;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [view]);

  // 🔤 Lomakekenttien muutos
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ Näytä kortti kun lomake lähetetään
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, age, message } = formData;
    if (!name || !age || !message) return;
    setIsShared(false); // ei jaettu linkki
    setView('card');
  };

  // 🔗 Linkin luonti ja kopio leikepöydälle
  const generateLink = () => {
    const params = new URLSearchParams(formData).toString();
    const url = `${window.location.origin}/birthday?${params}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  // 🎂 Kakku-näkymä
  if (view === 'card') {
    return (
      <Card
        {...formData}
        blownOut={false}
        onBlow={() => setView('greeting')}
      />
    );
  }

  // 🎉 Tervehdys-näkymä
  if (view === 'greeting') {
    return (
      <Greeting
        {...formData}
        sharedMode={isShared}
        onBack={() => {
          setIsShared(false);
          setView('form');
        }}
      />
    );
  }

  // 📝 Lomake (vain jos ei jaettu näkymä)
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
        <button type="submit">🎂 Show the Cake</button>
        <button type="button" onClick={generateLink}>📨 Share the Greeting</button>
      </form>
    </div>
  );
};

export default Birthday;

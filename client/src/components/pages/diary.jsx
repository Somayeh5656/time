// Tuodaan tarvittavat React-hookit ja kirjastot
import React, { useRef, useState, useEffect } from "react";
import "./diary.css";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { GrCirclePlay } from "react-icons/gr";
import { FaRegPauseCircle } from "react-icons/fa";
import { PiNotePencilFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "../../utils/axios";

const Diary = () => {
  // Tilahallinta
  const [text, setText] = useState(""); // Syötetyn muistiinpanon teksti
  const [notes, setNotes] = useState([]); // Tallennetut muistiinpanot
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null); // Muokattavan muistiinpanon indeksi
  const [mode, setMode] = useState("view"); // Käyttötila: 'view', 'new' tai 'edit'
  const [isDark, setIsDark] = useState(false); // Teemavalinta (dark/light)
  const [isPlaying, setIsPlaying] = useState(false); // Soittaako musiikkia
  const audioRef = useRef(null); // Ref musiikin hallintaan
  const date = new Date().toLocaleDateString(); // Nykyinen päivämäärä
  const navigate = useNavigate(); // Navigointifunktio React Routerista

  // Haetaan muistiinpanot ja alustetaan taustamusiikki kun komponentti renderöidään
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("/diaries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (e) {
        console.error("Failed to fetch notes", e);
      }
    };

    fetchNotes();

    // Musiikin alustus ja toisto
    audioRef.current = new Audio("/audio/laPetiteFilleDeLaMer.mp3");
    audioRef.current.loop = true;
    audioRef.current.play();
    setIsPlaying(true);

    // Siivous: pysäytetään musiikki kun komponentti poistuu
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  // Tallennetaan uusi tai muokattu muistiinpano
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in");

    try {
      if (mode === "new") {
        const res = await axios.post("/diaries", { text, date }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes((prev) => [res.data, ...prev]);
      } else if (mode === "edit" && selectedNoteIndex !== null) {
        const note = notes[selectedNoteIndex];
        const res = await axios.put(`/diaries/${note._id}`, { text }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedNotes = [...notes];
        updatedNotes[selectedNoteIndex] = res.data;
        setNotes(updatedNotes);
      }
      // Palataan katselutilaan
      setMode("view");
      setText("");
      setSelectedNoteIndex(null);
    } catch (e) {
      console.error("Failed to save note", e);
      alert("Failed to save note");
    }
  };

  // Aloitetaan uuden muistiinpanon kirjoitus
  const handleNewNote = () => {
    setText("");
    setMode("new");
    setSelectedNoteIndex(null);
  };

  // Aloitetaan olemassa olevan muokkaus
  const handleEditNote = (index) => {
    setText(notes[index].text);
    setSelectedNoteIndex(index);
    setMode("edit");
  };

  // Poistetaan muistiinpano
  const handleDeleteNote = async (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in");

    const note = notes[index];
    await axios.delete(`/diaries/${note._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setNotes((prev) => prev.filter((_, i) => i !== index));

    // Jos poistettiin muokattava muistiinpano, nollataan tila
    if (index === selectedNoteIndex) {
      setText("");
      setSelectedNoteIndex(null);
      setMode("view");
    }
  };

  // Vaihdetaan teemaa (vaalea/tumma)
  const handleThemeToggle = () => {
    setIsDark((prev) => !prev);
  };

  // Musiikin soiton ja pysäytyksen käsittely
  const togglePlay = () => {
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`diary-container ${isDark ? "light" : "dark"}`}>
      {/* Yläpalkki: takaisin-nappi, teeman vaihto ja tallenna-nappi */}
      <div className="header-controls">
        <span className="back-button-diary" onClick={() => navigate("/routines")}>
          <IoIosArrowBack size={28} />
        </span>

        <div className="right-controls">
          <label className="theme-toggle">
            <input type="checkbox" onChange={handleThemeToggle} checked={!isDark} />
            <span className="slider">
              {isDark
                ? (<span className="sun-icon"><FiSun size={16} /></span>)
                : (<span className="moon-icon"><FaRegMoon size={14} /></span>)}
            </span>
          </label>

          {(mode === "new" || mode === "edit") && (
            <span className="save-button" onClick={handleSave}>Save</span>
          )}
        </div>
      </div>

      {/* Otsikko ja päivämäärä */}
      <div className="dear-diary-header">
        <div className="dear-diary">Dear Diary ...</div>
        <span className="diary-date">{date}</span>
      </div>

      {/* Muistiinpanokenttä tai lista */}
      {mode === "new" || mode === "edit" ? (
        <textarea
          className="diary-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <div className="notes-list">
          {notes.map((note, index) => (
            <div className="saved-box" key={index} onClick={() => handleEditNote(index)}>
              <div className="titleDelete">
                <h2>{note.text.split("\n")[0] || "Untitled Entry"}</h2>
                <span
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(index);
                  }}
                >
                  <RiDeleteBin6Line />
                </span>
              </div>
              <span className="saved-date">{note.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* Alapalkki: musiikkinappi ja uuden merkinnän aloittaminen */}
      <div className="diary-footer">
        <span className="play-pause-button" onClick={togglePlay}>
          {isPlaying ? <FaRegPauseCircle size={22} /> : <GrCirclePlay size={22} />}
        </span>

        {mode === "view" && (
          <span className="note-icon" onClick={handleNewNote}>
            <PiNotePencilFill size={22} />
          </span>
        )}
      </div>
    </div>
  );
};

export default Diary;

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

const Diary = () => {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [mode, setMode] = useState("view"); // "view" | "new" | "edit"
  const [isDark, setIsDark] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const date = new Date().toLocaleDateString();
  const navigate=useNavigate();

  const handleSave = () => {
    if (mode === "new") {
    setNotes((prev) => [...prev, { text, date: new Date().toLocaleDateString() }]);
    } else if (mode === "edit" && selectedNoteIndex !== null) {
    const updated = [...notes];
    updated[selectedNoteIndex].text = text;
    setNotes(updated);
}
    setMode("view");
    setText("");
    setSelectedNoteIndex(null);
  };

  const handleNewNote = () => {
    setText("");
    setMode("new");
    setSelectedNoteIndex(null);
  };

  const handleEditNote = (index) => {
  setText(notes[index].text);
  setSelectedNoteIndex(index);
  setMode("edit");
};

const handleDeleteNote = (index) => {
  const confirmed = window.confirm("Are you sure you want to delete this note?");
  if (!confirmed) return;

  setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
  
  // Jos poistettiin muokattava merkintä, nollaa tilat
  if (index === selectedNoteIndex) {
    setText("");
    setSelectedNoteIndex(null);
    setMode("view");
  }
};

  const handleThemeToggle = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    audioRef.current = new Audio("/audio/laPetiteFilleDeLaMer.mp3");
    audioRef.current.loop = true;
    audioRef.current.play();
    setIsPlaying(true);

    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

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
      <div className="header-controls">
        <span className="back-button-diary" onClick={()=>navigate("/")}>
          <IoIosArrowBack size={28} />
        </span>

        <div className="right-controls">
          <label className="theme-toggle">
            <input type="checkbox" onChange={handleThemeToggle} checked={!isDark} />
            <span className="slider">
                {isDark ?                
                (<span  className="sun-icon" ><FiSun size={16}/></span>)
                :(<span  className="moon-icon" ><FaRegMoon size={14}/></span>)}
            </span>

          </label>

          {(mode === "new" || mode === "edit") && (
            <span className="save-button" onClick={handleSave}>
              Save
            </span>
          )}
        </div>
      </div>

      <div className="dear-diary-header">
        <div className="dear-diary">Dear Diary ...</div>
        <span className="diary-date">{date}</span>
      </div>

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
                     <span className="delete-icon" 
                     onClick={(e)=>{ e.stopPropagation();
                     handleDeleteNote(index);}}
                     ><RiDeleteBin6Line />
                     </span>
                </div>
                
                <span className="saved-date">{note.date}</span>
               
            </div>
            ))}
        </div>
      )}

      <div className="diary-footer">
        <span className="play-pause-button" onClick={togglePlay}>
          {isPlaying ? (
            <FaRegPauseCircle size={22} />
          ) : (
            <GrCirclePlay size={22} />
          )}
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

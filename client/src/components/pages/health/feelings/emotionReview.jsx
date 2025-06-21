import React, { useState, useEffect } from "react";
import Feelings from "./feelings"; // Alikomponentti tunteiden valintaan
import DescribeImpact from "./describeImpact"; // Alikomponentti vaikutusten kuvaamiseen
import "./emotionReview.css"; // Tyylitiedosto
import axios from "../../../../utils/axios"; // Mukautettu axios-instanssi
import { RiDeleteBin6Line } from "react-icons/ri"; // Roskakori-ikoni

const EmotionReview = () => {
  // Tilahookit
  const [logs, setLogs] = useState([]); // Tallennetut lokit
  const [step, setStep] = useState("review"); // Vaihe (review, feelings, describe)
  const [emotion, setEmotion] = useState(null); // Valittu tunne
  const [selectedFeelings, setSelectedFeelings] = useState([]); // Valitut tuntemukset
  const [selectedImpacts, setSelectedImpacts] = useState([]); // Valitut vaikutukset


  // Hakee aiemmin tallennetut tunteet palvelimelta
  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("/emotions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(response.data); // Aseta haetut lokit tilaan
      } catch (e) {
        console.log("Failed to fetch emotion logs:", e);
      }
    };
    fetchLogs();
  }, []);

  // Nollaa lomakeprosessin ja palaa aloitusvaiheeseen
  const resetFlow = () => {
    setStep("review");
    setEmotion(null);
    setSelectedFeelings([]);
    setSelectedImpacts([]);
  };

  // Lisää uusi tunnetietue palvelimelle
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

    console.log("newlog", newLog);

    try {
      const res = await axios.post("/emotions", newLog, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs([res.data, ...logs]); // Lisää uusi loki alkuun
    } catch (e) {
      console.error("Failed to add emotion", e);
    }

    resetFlow(); // Palaa aloitusvaiheeseen
  };

  // Poistaa tietyn lokin palvelimelta ja tilasta
  const handleDelete = async (logId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`/emotions/${logId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Poista loki tilasta
      setLogs((prevLogs) => prevLogs.filter((log) => log._id !== logId));
    } catch (e) {
      console.error("Failed to delete log:", e);
    }
  };

  // Vaihe: tunteiden valinta
  if (step === "feelings") {
    return (
      <Feelings
        onSelectEmotion={(selected) => {
          setEmotion(selected); // Aseta tunne
          setStep("describe"); // Siirry seuraavaan vaiheeseen
        }}
        onBack={resetFlow}
      />
    );
  }

  // Vaihe: vaikutusten kuvaaminen
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
        onDone={addLog} // Lähetä lopuksi palvelimelle
      />
    );
  }

  // Review-näkymä (oletus)
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
                <span
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this log?")) {
                      handleDelete(log._id);
                    }
                  }}
                  className="delete-log"
                >
                  <RiDeleteBin6Line />
                </span>
              </div>

              <div className="log-meta">
                <div className="log-tags">
                  {(log.feelings || []).map((f) => (
                      <span key={f} className="tag">{f}</span>
                    ))}

                    {(log.impacts || []).map((i) => (
                      <span key={i} className="tag-impact">{i}</span>
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

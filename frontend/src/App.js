import { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [displayedEssay, setDisplayedEssay] = useState("");
  const [score, setScore] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✨ TYPEWRITER EFFECT
  const typeEffect = (text) => {
    let i = 0;
    setDisplayedEssay("");

    const interval = setInterval(() => {
      setDisplayedEssay((prev) => prev + text[i]);
      i++;

      if (i >= text.length) clearInterval(interval);
    }, 10);
  };

  const generateEssay = async () => {
    if (!topic) return;

    setLoading(true);
    setEssay("");
    setDisplayedEssay("");
    setScore("");
    setHistory([]);

    try {
      const res = await axios.post("http://localhost:8000/generate", {
        topic: topic,
      });

      setEssay(res.data.essay);
      typeEffect(res.data.essay);
      setScore(res.data.score);
      setHistory(res.data.history);
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      position: "relative"
    }}>

      {/* ✨ PARTICLES */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${4 + Math.random() * 6}s`
          }}
        />
      ))}

      <div className="fade-in" style={{
        width: "100%",
        maxWidth: "850px",
        backdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 0 80px rgba(139,92,246,0.4)",
        border: "1px solid rgba(255,255,255,0.1)",
        zIndex: 1
      }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            fontSize: "42px",
            background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            🧠 VichaarAI
          </h1>

          <p style={{ color: "#cbd5f5", fontStyle: "italic" }}>
            Ask. Reflect. Receive.
          </p>
        </div>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Whisper your thought..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            marginBottom: "15px"
          }}
        />

        {/* BUTTON */}
        <button
          onClick={generateEssay}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.6)"
          }}
        >
          {loading ? "Consulting the Oracle..." : "Reveal Insight"}
        </button>

        {/* SCORE */}
        {score && (
          <div style={{
            marginTop: "25px",
            padding: "20px",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.05)"
          }}>
            <h3>📊 Insight Score</h3>
            <pre style={{ whiteSpace: "pre-wrap", color: "#e2e8f0" }}>
              {score}
            </pre>
          </div>
        )}

        {/* ESSAY */}
        {displayedEssay && (
          <div style={{
            marginTop: "25px",
            padding: "25px",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.05)",
            lineHeight: "1.8"
          }}>
            <h2>✨ Revealed Wisdom</h2>
            <p style={{ whiteSpace: "pre-wrap", color: "#e2e8f0" }}>
              {displayedEssay}
            </p>
          </div>
        )}

        {/* HISTORY */}
        {history.length > 0 && (
          <div style={{
            marginTop: "25px",
            padding: "20px",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.05)"
          }}>
            <h3>🔁 Thought Evolution</h3>

            {history.map((step, i) => (
              <div key={i} style={{
                marginTop: "15px",
                padding: "15px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)"
              }}>
                <p><strong>Iteration {i + 1}</strong></p>
                <p style={{ opacity: 0.8 }}>
                  {step.critique.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
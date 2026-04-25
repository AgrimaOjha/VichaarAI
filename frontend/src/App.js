import { useState, useEffect, useRef } from "react";
import axios from "axios";

const CHIPS = [
  "What is consciousness?",
  "Does free will exist?",
  "The nature of time",
  "Is reality a simulation?",
  "Why does anything exist?",
];

export default function App() {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOut, setShowOut] = useState(false);
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, pts = [];

    class Pt {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.2 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.a = Math.random() * 0.5 + 0.1;
        this.c = Math.random() > 0.6 ? "74,244,255" : "192,132,252";
        this.life = 0;
        this.maxLife = 200 + Math.random() * 300;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life++;
        if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H)
          this.reset();
      }
      draw() {
        const alpha = this.a * Math.sin((this.life / this.maxLife) * Math.PI);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.c},${alpha})`;
        ctx.fill();
      }
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function drawConnections() {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.strokeStyle = `rgba(74,244,255,${0.08 * (1 - d / 90)})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function drawRings() {
      tRef.current += 0.004;
      const cx = W * 0.5, cy = H * 0.45;
      for (let i = 1; i <= 4; i++) {
        const r = 80 + i * 60 + Math.sin(tRef.current + i) * 12;
        ctx.strokeStyle = `rgba(74,244,255,${0.015 + i * 0.008})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(3,5,15,0.12)";
      ctx.fillRect(0, 0, W, H);
      drawRings();
      pts.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 120; i++) pts.push(new Pt());
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!essay) return;
    let i = 0;
    setDisplayed("");
    const iv = setInterval(() => {
      setDisplayed(prev => prev + essay[i]);
      i++;
      if (i >= essay.length) clearInterval(iv);
    }, 9);
    return () => clearInterval(iv);
  }, [essay]);

  const transmit = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setShowOut(false);
    setVisible(false);
    setEssay("");
    setDisplayed("");
    setScore("");

    try {
      const res = await axios.post(
        "https://vichaarai-backend.onrender.com/generate",
        { topic }
      );

      setEssay(res.data.essay);
      setScore(res.data.score || "");
      setShowOut(true);
      setTimeout(() => setVisible(true), 20);

    } catch {
      setEssay("⏳ Server is waking up… please try again in a few seconds.");
      setShowOut(true);
      setTimeout(() => setVisible(true), 20);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      transmit();
    }
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Syne+Mono&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #03050f;
          color: #d4e8ff;
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .vi-canvas {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }

        .vi-wrap {
          position: relative; z-index: 1;
          max-width: 660px; margin: 0 auto;
          padding: 64px 24px 100px;
        }

        .vi-eyepiece {
          display: flex; justify-content: center;
          margin-bottom: 32px;
        }

        .vi-eye {
          width: 72px; height: 72px;
          animation: eyePulse 6s ease-in-out infinite;
        }

        @keyframes eyePulse {
          0%,100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(74,244,255,.53)); }
          50%      { transform: scale(1.08); filter: drop-shadow(0 0 22px rgba(74,244,255,.8)); }
        }

        .vi-brand { text-align: center; margin-bottom: 8px; }

        .vi-h1 {
          font-size: 52px; font-weight: 800;
          letter-spacing: -2px; line-height: 1;
          background: linear-gradient(100deg, #a0c8ff 0%, #4af4ff 45%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .vi-sub {
          font-family: 'Syne Mono', monospace;
          font-size: 11px; letter-spacing: 5px;
          color: rgba(74,244,255,.45);
          margin-top: 8px;
        }

        .vi-rift {
          width: 100%; height: 1px; margin: 32px 0;
          background: linear-gradient(90deg, transparent, rgba(74,244,255,.2), rgba(192,132,252,.35), rgba(74,244,255,.2), transparent);
          position: relative;
        }
        .vi-rift::before {
          content: '';
          position: absolute; top: -1px; left: 50%;
          transform: translateX(-50%);
          width: 6px; height: 3px;
          background: #4af4ff; border-radius: 50%;
          box-shadow: 0 0 12px #4af4ff;
        }

        .vi-panel {
          background: rgba(4,12,40,.7);
          border: 1px solid rgba(74,244,255,.12);
          border-radius: 20px; padding: 28px;
          position: relative; overflow: hidden;
          margin-bottom: 16px;
          backdrop-filter: blur(24px);
        }
        .vi-panel::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 40% at 20% 0%, rgba(74,244,255,.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 80% 100%, rgba(192,132,252,.06) 0%, transparent 60%);
        }

        .vi-panel-out {
          background: rgba(4,12,40,.8);
          border: 1px solid rgba(192,132,252,.15);
          border-radius: 20px; padding: 28px;
          margin-bottom: 14px;
          position: relative; overflow: hidden;
          transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1);
        }
        .vi-panel-out::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 50% 60% at 90% 10%, rgba(192,132,252,.07) 0%, transparent 60%);
        }
        .vi-panel-out.hidden  { opacity: 0; transform: translateY(20px); }
        .vi-panel-out.visible { opacity: 1; transform: translateY(0); }

        .vi-corner {
          position: absolute; width: 16px; height: 16px;
        }
        .vi-corner.tl { top:0; left:0;  border-top:1px solid rgba(74,244,255,.5);  border-left:1px solid rgba(74,244,255,.5);  border-radius:20px 0 0 0; }
        .vi-corner.tr { top:0; right:0; border-top:1px solid rgba(74,244,255,.5);  border-right:1px solid rgba(74,244,255,.5); border-radius:0 20px 0 0; }
        .vi-corner.bl { bottom:0; left:0;  border-bottom:1px solid rgba(74,244,255,.5); border-left:1px solid rgba(74,244,255,.5);  border-radius:0 0 0 20px; }
        .vi-corner.br { bottom:0; right:0; border-bottom:1px solid rgba(74,244,255,.5); border-right:1px solid rgba(74,244,255,.5); border-radius:0 0 20px 0; }

        .vi-corner-p { position: absolute; width: 16px; height: 16px; }
        .vi-corner-p.tl { top:0; left:0;  border-top:1px solid rgba(192,132,252,.5);  border-left:1px solid rgba(192,132,252,.5);  border-radius:20px 0 0 0; }
        .vi-corner-p.tr { top:0; right:0; border-top:1px solid rgba(192,132,252,.5);  border-right:1px solid rgba(192,132,252,.5); border-radius:0 20px 0 0; }
        .vi-corner-p.bl { bottom:0; left:0;  border-bottom:1px solid rgba(192,132,252,.5); border-left:1px solid rgba(192,132,252,.5);  border-radius:0 0 0 20px; }
        .vi-corner-p.br { bottom:0; right:0; border-bottom:1px solid rgba(192,132,252,.5); border-right:1px solid rgba(192,132,252,.5); border-radius:0 0 20px 0; }

        .vi-label {
          font-family: 'Syne Mono', monospace;
          font-size: 10px; letter-spacing: 4px;
          color: rgba(74,244,255,.5);
          margin-bottom: 12px;
        }

        .vi-textarea {
          width: 100%;
          background: rgba(74,244,255,.03);
          border: 1px solid rgba(74,244,255,.1);
          border-radius: 12px;
          padding: 16px 18px;
          color: #d4e8ff;
          font-family: 'Syne', sans-serif;
          font-size: 15px; line-height: 1.7;
          resize: none; outline: none;
          min-height: 90px;
          transition: border-color .3s, background .3s, box-shadow .3s;
        }
        .vi-textarea::placeholder { color: rgba(74,244,255,.2); font-style: italic; }
        .vi-textarea:focus {
          border-color: rgba(74,244,255,.4);
          background: rgba(74,244,255,.05);
          box-shadow: 0 0 40px rgba(74,244,255,.06), inset 0 0 20px rgba(74,244,255,.03);
        }

        .vi-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }

        .vi-chip {
          background: rgba(192,132,252,.06);
          border: 1px solid rgba(192,132,252,.2);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 12px;
          font-family: 'Syne Mono', monospace;
          color: rgba(192,132,252,.65);
          cursor: pointer;
          transition: all .2s;
          letter-spacing: .5px;
        }
        .vi-chip:hover {
          background: rgba(192,132,252,.14);
          border-color: rgba(192,132,252,.5);
          color: #c084fc;
          transform: translateY(-1px);
        }

        .vi-btn {
          width: 100%; padding: 17px;
          border: 1px solid rgba(74,244,255,.3);
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(74,244,255,.15), rgba(192,132,252,.2));
          color: #4af4ff;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 13px;
          letter-spacing: 3px; text-transform: uppercase;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform .2s, box-shadow .3s, border-color .3s;
        }
        .vi-btn::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(74,244,255,.12), transparent);
          transition: left .5s;
        }
        .vi-btn:hover::after { left: 100%; }
        .vi-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(74,244,255,.15), 0 12px 40px rgba(0,0,0,.4);
          border-color: rgba(74,244,255,.6);
        }
        .vi-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

        .vi-scan {
          height: 1px; margin-top: 16px;
          background: linear-gradient(90deg, transparent, #4af4ff, transparent);
          position: relative; overflow: hidden;
          transition: opacity .3s;
        }
        .vi-scan::after {
          content: '';
          position: absolute; top: 0; left: -40%;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent);
          animation: scanAnim 1.2s ease infinite;
        }
        @keyframes scanAnim { to { left: 100%; } }

        .vi-out-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(192,132,252,.12);
        }

        .vi-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #c084fc;
          box-shadow: 0 0 10px #c084fc;
          animation: sigPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes sigPulse {
          0%,100% { opacity: .6; transform: scale(1); }
          50%      { opacity: 1;  transform: scale(1.3); }
        }

        .vi-out-label {
          font-family: 'Syne Mono', monospace;
          font-size: 10px; letter-spacing: 4px;
          color: rgba(192,132,252,.6);
        }

        .vi-out-text {
          font-size: 15px; line-height: 1.9;
          color: rgba(212,232,255,.85);
          white-space: pre-wrap; font-weight: 400;
        }

        .vi-score {
          background: rgba(74,244,255,.04);
          border: 1px solid rgba(74,244,255,.1);
          border-radius: 10px; padding: 14px 18px;
          font-family: 'Syne Mono', monospace;
          font-size: 12px; letter-spacing: 1px;
          color: rgba(74,244,255,.5);
          text-align: center;
        }
      `}</style>

      <canvas ref={canvasRef} className="vi-canvas" />

      <div className="vi-wrap">

        <div className="vi-eyepiece">
          <svg className="vi-eye" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="34" stroke="rgba(74,244,255,0.15)" strokeWidth="1"/>
            <circle cx="36" cy="36" r="26" stroke="rgba(74,244,255,0.2)" strokeWidth="0.5"/>
            <ellipse cx="36" cy="36" rx="22" ry="10" stroke="rgba(74,244,255,0.4)" strokeWidth="1"/>
            <circle cx="36" cy="36" r="8" fill="rgba(74,244,255,0.08)" stroke="rgba(74,244,255,0.6)" strokeWidth="1"/>
            <circle cx="36" cy="36" r="4" fill="#4af4ff" opacity="0.9"/>
            <circle cx="38" cy="34" r="1.5" fill="white" opacity="0.6"/>
            <line x1="2"  y1="36" x2="14" y2="36" stroke="rgba(74,244,255,0.3)" strokeWidth="0.5"/>
            <line x1="58" y1="36" x2="70" y2="36" stroke="rgba(74,244,255,0.3)" strokeWidth="0.5"/>
            <line x1="36" y1="2"  x2="36" y2="14" stroke="rgba(74,244,255,0.3)" strokeWidth="0.5"/>
            <line x1="36" y1="58" x2="36" y2="70" stroke="rgba(74,244,255,0.3)" strokeWidth="0.5"/>
            <line x1="12" y1="12" x2="20" y2="20" stroke="rgba(74,244,255,0.2)" strokeWidth="0.5"/>
            <line x1="52" y1="52" x2="60" y2="60" stroke="rgba(74,244,255,0.2)" strokeWidth="0.5"/>
            <line x1="60" y1="12" x2="52" y2="20" stroke="rgba(74,244,255,0.2)" strokeWidth="0.5"/>
            <line x1="12" y1="60" x2="20" y2="52" stroke="rgba(74,244,255,0.2)" strokeWidth="0.5"/>
          </svg>
        </div>

        <div className="vi-brand">
          <h1 className="vi-h1">VichaarAI</h1>
          <p className="vi-sub">DIMENSIONAL INTELLIGENCE INTERFACE</p>
        </div>

        <div className="vi-rift" />

        <div className="vi-panel">
          <div className="vi-corner tl" /><div className="vi-corner tr" />
          <div className="vi-corner bl" /><div className="vi-corner br" />

          <div className="vi-label">// TRANSMIT QUERY</div>

          <textarea
            className="vi-textarea"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={handleKey}
            placeholder="What lies beyond the edge of consciousness…"
            rows={3}
          />

          <div className="vi-chips">
            {CHIPS.map(c => (
              <span key={c} className="vi-chip" onClick={() => setTopic(c)}>
                {c.toLowerCase()}
              </span>
            ))}
          </div>

          <button className="vi-btn" onClick={transmit} disabled={loading}>
            {loading ? "◌  PROCESSING..." : "◈  Transmit"}
          </button>

          {loading && <div className="vi-scan" />}
        </div>

        {showOut && (
          <div className={`vi-panel-out ${visible ? "visible" : "hidden"}`}>
            <div className="vi-corner-p tl" /><div className="vi-corner-p tr" />
            <div className="vi-corner-p bl" /><div className="vi-corner-p br" />
            <div className="vi-out-header">
              <div className="vi-dot" />
              <span className="vi-out-label">// SIGNAL RECEIVED</span>
            </div>
            <p className="vi-out-text">{displayed}</p>
          </div>
        )}

        {score && <div className="vi-score">◈  {score}</div>}

      </div>
    </>
  );
}
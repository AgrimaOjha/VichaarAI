# VichaarAI

# 🧠 VichaarAI

### *Think. Write. Refine.*

VichaarAI is a **multi-agent AI system** that transforms a simple topic into a **well-structured, refined essay** through reasoning, critique, and iterative improvement.

Unlike traditional generators, VichaarAI **thinks before it writes**—mimicking a human-like process of research, drafting, reviewing, and refinement.

---

## ✨ Demo Experience

> *Enter a thought → Watch it evolve → Receive refined insight*

* 🌌 Oracle-inspired UI with light & dark themes
* ✨ Typewriter effect for dynamic output
* 🔁 Transparent “AI Thought Process” visualization

---

## 🚀 Features

* 🔍 **Research Agent**
  Generates search queries and gathers contextual information

* ✍️ **Writer Agent**
  Produces structured essays (Introduction → Body → Conclusion)

* 🧐 **Critic Agent**
  Provides detailed feedback on logic, clarity, and depth

* 🔁 **Iterative Refinement Loop**
  Improves the essay over multiple passes using critique

* 📊 **Evaluator Agent**
  Scores the essay on clarity, structure, and depth

* 🌐 **Full-Stack Application**
  FastAPI backend + React frontend

* 🎨 **Immersive UI**
  Cosmic theme, glassmorphism, animations, and theme toggle

---

## 🧠 Architecture

```
User Input
   ↓
Research Agent → Web Search → Knowledge Summary
   ↓
Writer Agent → Initial Draft
   ↓
Critic Agent → Feedback
   ↓
Rewrite Loop (x3)
   ↓
Evaluator Agent → Scoring
   ↓
Final Essay Output + Thought Process
```

---

## 🏗️ Tech Stack

### Backend

* FastAPI
* Groq LLM API
* DuckDuckGo Search
* Python

### Frontend

* React.js
* Axios
* Custom CSS (Glassmorphism + animations)

---

## ⚙️ Setup Instructions

### 🔧 Backend

```bash
cd backend
pip install fastapi uvicorn groq duckduckgo-search python-dotenv
```

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

Run:

```bash
uvicorn main:app --reload
```

---

### 🎨 Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🌍 Usage

1. Open the app in your browser
2. Enter a topic
3. Click **“Reveal Insight”**
4. Watch the essay generate with a live typing effect
5. Explore the AI’s reasoning in the **Thought Evolution** section

---

## 💡 Key Highlights

* 🧠 Demonstrates **Agentic AI Design**
* 🔁 Implements **Self-Reflection Loops**
* 🌐 Integrates **Retrieval-Augmented Generation (RAG-like flow)**
* 🎯 Focuses on **Explainability & Transparency**
* 🎨 Combines **AI + UX for immersive experience**

---

## 🧪 Future Enhancements

* 📄 Export essay as PDF
* 🌌 Advanced animated starfield background
* 🎤 Voice input support
* 📚 Inline citations (true RAG)
* ☁️ Deployment (Vercel + Render)

---

## 🏆 Inspiration

Built with the idea that AI shouldn’t just generate—
it should **reason, reflect, and refine**.

---

## 👩‍💻 Author

**Agrima Ojha**
BTech CS (AI)
Passionate about building intelligent systems and meaningful tech

---

## ⭐ Final Note

VichaarAI is not just an essay generator.
It’s a step toward **thinking machines**.

---

# 👁️ EyeGuard - AI-Powered Eye Symptom Triage

> **Winner/Project for [Insert Hackathon Name]** > *Instant, privacy-first eye health assessment using Serverless AI.*

[🔴 Live Demo](https://assistivex.netlify.app/) | [📺 Video Demo](https://youtu.be/ZGPNdsWMObU) | 



## 🚀 The Problem
- **"Dr. Google" causes panic:** searching symptoms often leads to worst-case scenarios.
- **ER Overcrowding:** People rush to hospitals for mild issues like eye strain.
- **Silent Vision Loss:** Critical conditions like *Retinal Detachment* are ignored until it's too late.

## 💡 The Solution: EyeGuard
EyeGuard is a **Progressive Web App (PWA)** that acts as an intelligent first line of defense. It uses **Groq's ultra-fast Llama-3 AI** to analyze symptoms instantly and triage users into three risk categories:
1.  🔴 **Urgent:** Immediate medical attention needed (e.g., Retinal Detachment).
2.  🟡 **Moderate:** Consult a specialist soon (e.g., Cataracts, Infections).
3.  🟢 **Mild:** Home care and monitoring (e.g., Dry Eye, Strain).



## 🛠️ Tech Stack (Modern & Serverless)

| Component | Technology Used | Why? |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JS | Lightweight, zero-load time, works on all devices. |
| **Backend** | **Netlify Functions** (Node.js) | Serverless architecture. No server management, scales infinitely. |
| **AI Engine** | **Groq API** (Llama-3.3-70b) | **Instant inference** (<0.5s latency) compared to GPT-4. |
| **Privacy** | Stateless Execution | HIPAA-compliant approach; no user data is stored. |



## ⚙️ Architecture Flow
1.  **User Input:** User selects symptoms (e.g., "Flashes", "Curtain effect") on the frontend.
2.  **Secure Request:** Frontend sends data to the protected endpoint `/.netlify/functions/gemini`.
3.  **Serverless Processing:** Netlify Function wakes up, validates the request, and injects the hidden API key.
4.  **AI Analysis:** Data is sent to **Groq**, which applies medical triage logic.
5.  **Response:** The app displays a color-coded risk assessment (Green/Yellow/Red) with actionable advice.



## 📸 Features
* ✅ **Visual Symptom Verification:** Interactive simulations (e.g., Wavy Lines test) to confirm symptoms.
* ✅ **Zero-Login Access:** frictionless experience for emergencies.
* ✅ **Glassmorphism UI:** Modern, accessible, and clean design.
* ✅ **Secure Environment Variables:** API keys are never exposed to the client.



## 🚀 Local Setup & Installation

To run this project locally, you need the **Netlify CLI** because it uses serverless functions.

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/your-username/EyeGuard.git](https://github.com/your-username/EyeGuard.git)
    cd EyeGuard
    ```

2.  **Install Netlify CLI (Global)**
    ```bash
    npm install netlify-cli -g
    ```

3.  **Run Locally**
    ```bash
    netlify dev
    ```
    *The app will start at `http://localhost:8888` and functions will be emulated automatically.*



## 🔒 Environment Variables
This project requires a **Groq API Key** to function.
- `GROQ_API_KEY`: Get a free key at [console.groq.com](https://console.groq.com).




*Disclaimer: EyeGuard is an AI-assisted triage tool, not a doctor. Always seek professional medical advice for serious symptoms.*
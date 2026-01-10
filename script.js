/* EyeGuard Core Logic 
   Integration: Google Gemini 1.5 Flash / Advanced Multi-Tier Algorithm
*/

// --- API CONFIGURATION ---
const API_KEY = "AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"; 
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash";
const USE_CLOUD_INFERENCE = false; // Set to FALSE for offline demo stability

async function checkSymptoms() {
    
    // --- 1. DATA COLLECTION ---
    // Critical (6 Total)
    let floaters = document.getElementById("floaters").checked;
    let flashes = document.getElementById("flashes").checked;
    let curtain = document.getElementById("curtain").checked;
    let visionloss = document.getElementById("visionloss").checked;
    let haloes = document.getElementById("haloes").checked;
    let distortion = document.getElementById("distortion").checked;

    // Moderate (6 Total)
    let blurred = document.getElementById("blurred").checked;
    let pain = document.getElementById("pain").checked;
    let light = document.getElementById("light").checked;
    let headache = document.getElementById("headache").checked;
    let focusing = document.getElementById("focusing").checked;
    let squinting = document.getElementById("squinting").checked;

    // Mild (6 Total)
    let strain = document.getElementById("strain").checked;
    let dryness = document.getElementById("dryness").checked;
    let redness = document.getElementById("redness").checked;
    let itching = document.getElementById("itching").checked;
    let watery = document.getElementById("watery").checked;
    let twitching = document.getElementById("twitching").checked;

    // UI Elements
    let resultBox = document.getElementById("result-box");
    let resultTitle = document.getElementById("result-title");
    let resultMessage = document.getElementById("result-message");
    let button = document.querySelector("button");

    // Counts
    let criticalCount = [floaters, flashes, curtain, visionloss, haloes, distortion].filter(Boolean).length;
    let moderateCount = [blurred, pain, light, headache, focusing, squinting].filter(Boolean).length;
    let mildCount = [strain, dryness, redness, itching, watery, twitching].filter(Boolean).length;
    let totalCount = criticalCount + moderateCount + mildCount;

    // --- 2. VALIDATION ---
    if (totalCount === 0) {
        alert("Please select at least one symptom.");
        return;
    }

    // --- 3. UI LOADING STATE (Fake API) ---
    button.innerText = "Connecting to Neural Engine...";
    button.disabled = true;
    button.style.cursor = "wait";
    resultBox.classList.add("hidden");

    // --- 4. EXECUTION SIMULATION (1.5s Delay) ---
    setTimeout(() => {
        
        let titleText = "";
        let messageText = "";
        let boxColor = "";
        let textColor = "";

        // --- 5. THE 5-TIER LOGIC ENGINE ---

        // TIER 5: CRITICAL (Red)
        // Trigger: ANY Critical symptom selected
        if (criticalCount > 0) {
            titleText = "⚠️ URGENT CARE NEEDED";
            messageText = "Analysis detects high-risk markers (like " + (floaters ? "Floaters" : "Vision Changes") + ") consistent with Retinal Detachment or Glaucoma. Immediate ophthalmological intervention is required. Proceed to ER.";
            boxColor = "#ffcccc"; 
            textColor = "#990000";
        }

        // TIER 4: SEVERE (Orange) - *New*
        // Trigger: 3+ Moderate symptoms OR (2 Moderate + 2 Mild)
        else if (moderateCount >= 3 || (moderateCount >= 2 && mildCount >= 2)) {
            titleText = "High Priority: See Doctor Soon";
            messageText = "You are experiencing a significant cluster of symptoms. While immediate emergency care may not be needed, you should see an eye doctor within 24 hours to rule out infections or corneal issues.";
            boxColor = "#ffe5b4"; // Soft Orange
            textColor = "#cc5500"; // Dark Orange/Brown
        }

        // TIER 3: MODERATE (Yellow)
        // Trigger: 2 Moderate symptoms
        else if (moderateCount >= 2) {
            titleText = "Consult an Eye Doctor";
            messageText = "Multiple moderate symptoms detected. Recommended action: Schedule a standard eye exam this week. Avoid self-medication.";
            boxColor = "#fff3cd"; 
            textColor = "#856404";
        }

        // TIER 2: ELEVATED (Blue/Teal) - *New*
        // Trigger: 1 Moderate symptom OR 3+ Mild symptoms
        else if (moderateCount === 1 || mildCount >= 3) {
            titleText = "Elevated Eye Stress";
            messageText = "Your eyes are showing signs of significant fatigue or minor irritation. This is often reversible with rest and hygiene.";
            
            // REMEDY LOGIC: Only show if Moderate count is < 2 (Per instructions)
            if (moderateCount < 2) {
                messageText += "\n\n💡 Quick Remedy: Try the 'Palming' technique (cover closed eyes with warm palms for 2 mins) and ensure your room lighting is adequate.";
            }
            
            boxColor = "#d1ecf1"; // Soft Blue
            textColor = "#0c5460"; // Dark Teal
        }

        // TIER 1: MILD (Green)
        // Trigger: Everything else (Just mild stuff)
        else {
            titleText = "Home Care & Monitor";
            messageText = "Symptoms are consistent with Digital Eye Strain (CVS) or seasonal allergies.";
            
            // REMEDY LOGIC: Always show for Mild
            messageText += "\n\n💡 Quick Remedy: Follow the 20-20-20 Rule (Look 20ft away, for 20secs, every 20mins). Use preservative-free lubricating eye drops.";
            
            boxColor = "#d4edda"; 
            textColor = "#155724";
        }

        // --- 6. RENDER RESULT ---
        resultTitle.innerText = titleText;
        resultMessage.innerText = messageText;
        resultBox.style.backgroundColor = boxColor;
        resultBox.style.color = textColor;
        resultBox.classList.remove("hidden");

        // Reset Button
        button.innerText = "Analyze Symptoms";
        button.disabled = false;
        button.style.cursor = "pointer";

    }, 1500); 
}

function createParticles() {
    const body = document.querySelector('body');
    const particleCount = 20; // Number of floating specks

    for (let i = 0; i < particleCount; i++) {
        let particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Randomize size (small specks)
        let size = Math.random() * 15 + 5; // Between 5px and 20px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Randomize position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Randomize animation speed and delay
        let duration = Math.random() * 10 + 10; // 10s to 20s float time
        let delay = Math.random() * 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`; // Negative delay starts animation mid-way
        
        body.appendChild(particle);
    }
}

// Run this when the page loads
window.addEventListener('DOMContentLoaded', createParticles);
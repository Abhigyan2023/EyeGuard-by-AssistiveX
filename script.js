/* EyeGuard - Secure Frontend Logic
   Connects to Netlify Functions to protect the API Key.
*/

async function checkSymptoms() {
    
    // --- 1. DATA COLLECTION ---
    // We check all 18 checkboxes to build the symptom list
    let selectedSymptoms = [];

    // Critical Symptoms (The "Red Flags")
    if (document.getElementById("floaters").checked) selectedSymptoms.push("Sudden Floaters");
    if (document.getElementById("flashes").checked) selectedSymptoms.push("Flashes of Light");
    if (document.getElementById("curtain").checked) selectedSymptoms.push("Curtain/Shadow over vision");
    if (document.getElementById("visionloss").checked) selectedSymptoms.push("Sudden Vision Loss");
    if (document.getElementById("haloes").checked) selectedSymptoms.push("Haloes around lights");
    if (document.getElementById("distortion").checked) selectedSymptoms.push("Distorted/Wavy Lines");

    // Moderate Symptoms
    if (document.getElementById("blurred").checked) selectedSymptoms.push("Blurred Vision");
    if (document.getElementById("pain").checked) selectedSymptoms.push("Eye Pain");
    if (document.getElementById("light").checked) selectedSymptoms.push("Light Sensitivity");
    if (document.getElementById("headache").checked) selectedSymptoms.push("Headache around eyes");
    if (document.getElementById("focusing").checked) selectedSymptoms.push("Trouble focusing");
    if (document.getElementById("squinting").checked) selectedSymptoms.push("Frequent Squinting");

    // Mild Symptoms
    if (document.getElementById("strain").checked) selectedSymptoms.push("Eye Strain");
    if (document.getElementById("dryness").checked) selectedSymptoms.push("Dryness");
    if (document.getElementById("redness").checked) selectedSymptoms.push("Redness");
    if (document.getElementById("itching").checked) selectedSymptoms.push("Itching");
    if (document.getElementById("watery").checked) selectedSymptoms.push("Watery Eyes");
    if (document.getElementById("twitching").checked) selectedSymptoms.push("Eyelid Twitching");

    // UI Elements
    let resultBox = document.getElementById("result-box");
    let resultTitle = document.getElementById("result-title");
    let resultMessage = document.getElementById("result-message");
    let button = document.querySelector("button");

    // --- 2. VALIDATION ---
    if (selectedSymptoms.length === 0) {
        alert("Please select at least one symptom.");
        return;
    }

    // --- 3. SHOW LOADING STATE ---
    button.innerText = "Analyzing Securely...";
    button.disabled = true;
    button.style.cursor = "wait";
    resultBox.classList.add("hidden");

    try {
        // --- 4. CALL THE NETLIFY BACKEND ---
        // We send the data to our own server function, NOT directly to Google
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms: selectedSymptoms.join(", ") })
        });

        const data = await response.json();

        // Check if our server sent an error
        if (data.error) throw new Error(data.error);

        // --- 5. DISPLAY THE RESULT ---
        const aiText = data.result;
        
        resultTitle.innerText = "Assessment Result";
        resultMessage.innerText = aiText;

        // Smart Color Logic based on AI's keywords
        if (aiText.includes("URGENT") || aiText.includes("Emergency")) {
            resultBox.style.backgroundColor = "#ffcccc"; // Red
            resultBox.style.color = "#990000";
        } else if (aiText.includes("Consult")) {
            resultBox.style.backgroundColor = "#fff3cd"; // Yellow
            resultBox.style.color = "#856404";
        } else {
            resultBox.style.backgroundColor = "#d4edda"; // Green
            resultBox.style.color = "#155724";
        }

        resultBox.classList.remove("hidden");

    } catch (error) {
        console.error("API Error:", error);
        
        // Graceful Error Handling for the user
        resultTitle.innerText = "Connection Error";
        resultMessage.innerText = "Could not analyze symptoms. Please check your internet connection.";
        resultBox.style.backgroundColor = "#f8d7da"; // Error Pink
        resultBox.style.color = "#721c24";
        resultBox.classList.remove("hidden");
    }

    // --- 6. RESET BUTTON ---
    button.innerText = "Check Eye Health";
    button.disabled = false;
    button.style.cursor = "pointer";
}

/* Background Animation Generator
   (Keeps the professional floating particles look)
*/
function createParticles() {
    const body = document.querySelector('body');
    const particleCount = 20; // Number of floating specks

    for (let i = 0; i < particleCount; i++) {
        let particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Randomize size (small specks)
        let size = Math.random() * 15 + 5; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Randomize position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Randomize animation speed
        let duration = Math.random() * 10 + 10; 
        let delay = Math.random() * 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        
        body.appendChild(particle);
    }
}

// Start animation when page loads
window.addEventListener('DOMContentLoaded', createParticles);
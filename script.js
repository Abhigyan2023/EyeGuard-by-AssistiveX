// 1. SETUP: PASTE YOUR KEY HERE
// Go to aistudio.google.com to get this key.
const API_KEY = "AIzaSyDJO0QmNIvvnEbz5cH3Mh3tNAaK4OBrBuc"; 

async function checkSymptoms() {
    
    // --- STEP 1: GATHER DATA FROM HTML ---
    let selectedSymptoms = [];

    // Critical Red Flags
    if (document.getElementById("floaters").checked) selectedSymptoms.push("Sudden Floaters");
    if (document.getElementById("flashes").checked) selectedSymptoms.push("Flashes of Light");
    if (document.getElementById("curtain").checked) selectedSymptoms.push("Curtain/Shadow over vision");
    
    // Moderate Symptoms
    if (document.getElementById("blurred").checked) selectedSymptoms.push("Blurred Vision");
    if (document.getElementById("pain").checked) selectedSymptoms.push("Eye Pain");
    if (document.getElementById("light").checked) selectedSymptoms.push("Light Sensitivity");

    // Mild Symptoms
    if (document.getElementById("strain").checked) selectedSymptoms.push("Eye Strain");
    if (document.getElementById("dryness").checked) selectedSymptoms.push("Dry Eyes");
    if (document.getElementById("redness").checked) selectedSymptoms.push("Redness");

    // Get the HTML elements we need to change
    let resultBox = document.getElementById("result-box");
    let resultTitle = document.getElementById("result-title");
    let resultMessage = document.getElementById("result-message");
    let button = document.querySelector("button");

    // --- STEP 2: BASIC VALIDATION ---
    // If list is empty, stop here.
    if (selectedSymptoms.length === 0) {
        alert("Please select at least one symptom.");
        return;
    }

    // --- STEP 3: SHOW LOADING STATE ---
    // Change button text so user knows something is happening
    button.innerText = "Analyzing with AI...";
    button.disabled = true; // Prevent double-clicking
    resultBox.classList.add("hidden"); // Hide previous results if any

    // --- STEP 4: CREATE THE PROMPT ---
    // We tell the AI how to behave strictly.
    const prompt = `
        Act as a strictly rule-based medical triage assistant. 
        The user has these eye symptoms: ${selectedSymptoms.join(", ")}.
        
        INSTRUCTIONS:
        1. If specific critical symptoms (Floaters, Flashes, Curtain) are present, the status MUST be "URGENT CARE NEEDED".
        2. If multiple moderate symptoms (Pain, Blur) are present, status is "Consult an Eye Doctor".
        3. Otherwise, status is "Home Care & Monitor".
        
        OUTPUT FORMAT:
        Provide the response in plain text. 
        First line: The Status (from above).
        Second line: A short, calm 2-sentence advice explaining why.
        Do NOT mention "I am an AI". Do NOT give a diagnosis.
    `;

    // --- STEP 5: SEND TO GOOGLE GEMINI API ---
    try {
        // This is the "Fetch" command that talks to the internet
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                }),
            }
        );

        // Convert the "raw" response to readable JSON data
        const data = await response.json();

        // Extract the actual text answer from the complex data structure
        const aiText = data.candidates[0].content.parts[0].text;

        // --- STEP 6: UPDATE THE WEBPAGE ---
        resultTitle.innerText = "Assessment Result";
        resultMessage.innerText = aiText;
        
        // Smart Color Logic: Check what the AI said to pick a color
        if (aiText.includes("URGENT")) {
            resultBox.style.backgroundColor = "#ffcccc"; // Red
            resultBox.style.color = "#990000";
        } else if (aiText.includes("Consult")) {
            resultBox.style.backgroundColor = "#fff3cd"; // Yellow
            resultBox.style.color = "#856404";
        } else {
            resultBox.style.backgroundColor = "#d4edda"; // Green
            resultBox.style.color = "#155724";
        }

        // Reveal the box
        resultBox.classList.remove("hidden");

    } catch (error) {
        // If internet fails or API key is wrong
        console.error("Error:", error);
        resultTitle.innerText = "Connection Error";
        resultMessage.innerText = "Could not reach the AI. Please check your internet connection.";
        resultBox.classList.remove("hidden");
        resultBox.style.backgroundColor = "#e2e3e5"; // Grey
    }

    // --- STEP 7: RESET BUTTON ---
    button.innerText = "Check Eye Health";
    button.disabled = false;
}
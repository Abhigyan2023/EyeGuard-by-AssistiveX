// 1. SETUP: PASTE YOUR HUGGING FACE TOKEN HERE
// Get it from: https://huggingface.co/settings/tokens
const HF_TOKEN = "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"; 

// We use the "Mistral-7B-Instruct" model. It's fast and good at medical logic.
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

async function checkSymptoms() {
    
    // --- STEP 1: GATHER DATA ---
    let selectedSymptoms = [];

    // Critical
    if (document.getElementById("floaters").checked) selectedSymptoms.push("Sudden Floaters");
    if (document.getElementById("flashes").checked) selectedSymptoms.push("Flashes of Light");
    if (document.getElementById("curtain").checked) selectedSymptoms.push("Curtain/Shadow over vision");
    
    // Moderate
    if (document.getElementById("blurred").checked) selectedSymptoms.push("Blurred Vision");
    if (document.getElementById("pain").checked) selectedSymptoms.push("Eye Pain");
    if (document.getElementById("light").checked) selectedSymptoms.push("Light Sensitivity");

    // Mild
    if (document.getElementById("strain").checked) selectedSymptoms.push("Eye Strain");
    if (document.getElementById("dryness").checked) selectedSymptoms.push("Dry Eyes");
    if (document.getElementById("redness").checked) selectedSymptoms.push("Redness");

    // UI Elements
    let resultBox = document.getElementById("result-box");
    let resultTitle = document.getElementById("result-title");
    let resultMessage = document.getElementById("result-message");
    let button = document.querySelector("button");

    // Basic Check
    if (selectedSymptoms.length === 0) {
        alert("Please select at least one symptom.");
        return;
    }

    // --- STEP 2: SHOW LOADING ---
    button.innerText = "Analyzing with Hugging Face...";
    button.disabled = true;
    resultBox.classList.add("hidden");

    // --- STEP 3: PREPARE PROMPT ---
    // Mistral model works best with this specific [INST] format
    const prompt = `[INST] 
    You are a strict medical triage assistant.
    User symptoms: ${selectedSymptoms.join(", ")}.
    
    RULES:
    1. If Critical (Floaters, Flashes, Curtain), start with "URGENT CARE NEEDED".
    2. If Moderate (Pain, Blur), start with "Consult an Eye Doctor".
    3. If Mild, start with "Home Care & Monitor".
    
    Return ONLY the status followed by 2 sentences of advice. Do not say "Here is the assessment".
    [/INST]`;

    // --- STEP 4: CALL HUGGING FACE API ---
    try {
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 150, // Limit answer length
                    return_full_text: false // Don't repeat the prompt back to us
                }
            })
        });

        const data = await response.json();

        // Check for specific Hugging Face errors (like "Model Loading")
        if (data.error) {
            throw new Error(data.error);
        }

        // --- STEP 5: DISPLAY RESULT ---
        // Hugging Face returns an array: [{ generated_text: "..." }]
        const aiText = data[0].generated_text.trim();

        resultTitle.innerText = "Assessment Result";
        resultMessage.innerText = aiText;

        // Color Logic
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

        resultBox.classList.remove("hidden");

    } catch (error) {
        console.error("API Error:", error);
        
        // Handle "Model Loading" error specifically
        if (error.message.includes("loading")) {
            resultTitle.innerText = "Model is Waking Up...";
            resultMessage.innerText = "The AI model is loading on the server (Cold Start). Please wait 20 seconds and try again.";
            resultBox.style.backgroundColor = "#e2e3e5"; // Grey
        } else {
            resultTitle.innerText = "Connection Error";
            resultMessage.innerText = "Could not reach Hugging Face. Check your token and internet.";
            resultBox.style.backgroundColor = "#f8d7da"; // Pink error
        }
        
        resultBox.classList.remove("hidden");
    }

    // Reset Button
    button.innerText = "Check Eye Health";
    button.disabled = false;
}
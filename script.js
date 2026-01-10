function checkSymptoms() {
    // 1. getting checkboxes (Inputs)
    // taken elements by their specific id's from html file.
    
    // Critical Symptoms
    let floaters = document.getElementById("floaters").checked;
    let flashes = document.getElementById("flashes").checked;
    let curtain = document.getElementById("curtain").checked;

    // Moderate Symptoms
    let blurred = document.getElementById("blurred").checked;
    let pain = document.getElementById("pain").checked;
    let light = document.getElementById("light").checked;

    // Mild Symptoms(emergency) will have red alert
    let strain = document.getElementById("strain").checked;
    let dryness = document.getElementById("dryness").checked;
    let redness = document.getElementById("redness").checked;

    // 2. result var
    let titleText = "";
    let messageText = "";
    let boxColor = "";
    let textColor = "";

    // 3. LOGIC (The Rule-Based System)
    
    // Check Moderate Count (how many moderate symptoms are selected?)
    let moderateCount = 0;
    if (blurred) { moderateCount = moderateCount + 1; }
    if (pain)    { moderateCount = moderateCount + 1; }
    if (light)   { moderateCount = moderateCount + 1; }


    // RULE 1: CRITICAL (Emergency)
    // If ANY critical symptom is checked, this is the highest priority.
    if (floaters || flashes || curtain) {
        titleText = "⚠️ URGENT ATTENTION NEEDED";
        messageText = "You have selected symptoms that could indicate a retinal issue or other urgent condition. Please go to an Eye Hospital or Emergency Room immediately.";
        boxColor = "#ffcccc"; // Light red background
        textColor = "#990000"; // Dark red text
    }

    // RULE 2: MULTIPLE MODERATE
    // If Rule 1 was false, we check if 2 or more moderate symptoms exist.
    else if (moderateCount >= 2) {
        titleText = "Consult an Eye Doctor";
        messageText = "You are experiencing multiple symptoms. It is highly recommended to schedule an appointment with an ophthalmologist soon.";
        boxColor = "#fff3cd"; // Light yellow background
        textColor = "#856404"; // Dark yellow/brown text
    }

    // RULE 3: MILD OR SINGLE MODERATE
    // If they have mild symptoms OR just 1 moderate symptom.
    else if (strain || dryness || redness || moderateCount === 1) {
        titleText = "Rest & Monitor";
        messageText = "Your symptoms appear mild. Try the 20-20-20 rule (look at something 20 feet away for 20 seconds every 20 minutes). If it gets worse, see a doctor.";
        boxColor = "#d4edda"; // Light green background
        textColor = "#155724"; // Dark green text
    }

    // RULE 4: NO SYMPTOMS SELECTED
    else {
        titleText = "No Symptoms Selected";
        messageText = "Please select at least one symptom from the list above.";
        boxColor = "#e2e3e5"; // Grey background
        textColor = "#383d41"; // Dark grey text
    }

    // 4. DISPLAY THE RESULT
    // Get the result box elements
    let resultBox = document.getElementById("result-box");
    let resultTitle = document.getElementById("result-title");
    let resultMessage = document.getElementById("result-message");

    // Put the text inside the HTML
    resultTitle.innerText = titleText;
    resultMessage.innerText = messageText;

    // Apply the colors
    resultBox.style.backgroundColor = boxColor;
    resultBox.style.color = textColor;

    // Make the box visible (remove the 'hidden' class)
    resultBox.classList.remove("hidden");
}
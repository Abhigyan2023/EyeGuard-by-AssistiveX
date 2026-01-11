// netlify/functions/gemini.js

exports.handler = async function (event, context) {
    console.log("Function triggered!"); // Debug log

    // 1. Security: Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // 2. Parse Input
        const body = JSON.parse(event.body);
        const symptoms = body.symptoms;

        // 3. Define Prompt
        const prompt = `
            Act as a medical triage assistant.
            User symptoms: ${symptoms}.
            Rules:
            - If Critical (Floaters, Flashes, Curtain), start with "URGENT CARE NEEDED".
            - If Moderate (Pain, Blur), start with "Consult an Eye Doctor".
            - If Mild, start with "Home Care & Monitor".
            - Keep explanation under 2 sentences.
        `;

        // 4. Call Google Gemini (Using Native Fetch)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();

        // 5. Check for Errors from Google
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            throw new Error(data.error.message || "AI Service Error");
        }

        // 6. Return Result
        if (data.candidates && data.candidates.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ result: data.candidates[0].content.parts[0].text })
            };
        } else {
            throw new Error("No response from AI");
        }

    } catch (error) {
        console.error("Server Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Analysis Failed. Please try again." })
        };
    }
};
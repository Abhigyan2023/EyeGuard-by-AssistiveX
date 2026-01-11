// netlify/functions/gemini.js

exports.handler = async function (event, context) {
    // 1. Only allow POST requests (security)
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // 2. Parse the symptoms sent from your frontend
        const body = JSON.parse(event.body);
        const symptoms = body.symptoms;

        // 3. Define the Prompt
        const prompt = `
            Act as a medical triage assistant.
            User symptoms: ${symptoms}.
            Rules:
            - If Critical (Floaters, Flashes, Curtain), start with "URGENT CARE NEEDED".
            - If Moderate (Pain, Blur), start with "Consult an Eye Doctor".
            - If Mild, start with "Home Care & Monitor".
            - Keep explanation under 2 sentences.
        `;

        // 4. Securely call Google Gemini
        // We use the builtin fetch (available in Node 18+)
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

        // 5. Send the answer back to your frontend
        if (data.candidates && data.candidates.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ result: data.candidates[0].content.parts[0].text })
            };
        } else {
            throw new Error("No response from AI");
        }

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Analysis Failed" })
        };
    }
};
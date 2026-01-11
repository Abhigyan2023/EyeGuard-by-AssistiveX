// netlify/functions/gemini.js

exports.handler = async function (event, context) {
    console.log("Function triggered!"); 

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const symptoms = body.symptoms;

        // 1. FIX: Clean the API Key (Remove accidental spaces/newlines)
        // This is likely why you were getting 404s!
        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";

        if (!apiKey) {
            throw new Error("API Key is missing in Netlify settings.");
        }

        const prompt = `
            Act as a medical triage assistant.
            User symptoms: ${symptoms}.
            Rules:
            - If Critical (Floaters, Flashes, Curtain, Vision Loss), start with "URGENT CARE NEEDED".
            - If Moderate (Pain, Blur, Haloes), start with "Consult an Eye Doctor".
            - If Mild, start with "Home Care & Monitor".
            - Keep explanation under 2 sentences.
        `;

        // 2. USE STANDARD MODEL: gemini-1.5-flash (Fastest & Most Reliable)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();

        // Error Handling
        if (data.error) {
            console.error("Gemini API Error:", JSON.stringify(data.error, null, 2));
            throw new Error(data.error.message || "AI Service Error");
        }

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
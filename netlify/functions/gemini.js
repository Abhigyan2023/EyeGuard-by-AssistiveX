// netlify/functions/gemini.js
// Updated to use the latest Groq model (Llama 3.3)

exports.handler = async function (event, context) {
    console.log("Groq Function triggered!"); 

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const symptoms = body.symptoms;

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("GROQ_API_KEY is missing in Netlify settings.");
        }

        const systemPrompt = `
            You are an expert medical triage assistant.
            Rules:
            - If symptoms include "Sudden Floaters", "Flashes of Light", "Curtain over vision", or "Sudden Vision Loss", start response with "URGENT CARE NEEDED" and warn about Retinal Detachment.
            - If symptoms are "Eye Pain", "Blurred Vision", "Haloes", start with "Consult an Eye Doctor".
            - If symptoms are "Strain", "Dryness", "Itching", start with "Home Care & Monitor".
            - Keep the response short (under 3 sentences).
        `;

        // FIX: Updated to 'llama-3.3-70b-versatile' (The current active model)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // <--- THIS IS THE FIX
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Patient reports: ${symptoms}` }
                ],
                temperature: 0.5,
                max_tokens: 100
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Groq API Error:", data.error);
            throw new Error(data.error.message || "AI Service Error");
        }

        const aiText = data.choices[0].message.content;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ result: aiText })
        };

    } catch (error) {
        console.error("Server Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Analysis Failed. Please try again." })
        };
    }
};
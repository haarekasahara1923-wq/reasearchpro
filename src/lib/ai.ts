import { groq, openai, getGenAI } from "./ai-clients";

export async function generateWithFallback(
    prompt: string,
    systemPrompt: string = "You are a professional academic research assistant.",
    isJson: boolean = false
) {
    console.log("Environment Check:", {
        hasGroq: !!process.env.GROQ_API_KEY,
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasGemini: !!process.env.GEMINI_API_KEY,
    });

    // 1. Try GROQ
    try {
        if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY missing");
        console.log("Attempting generation with GROQ...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            model: "llama-3.1-70b-versatile", // Using a more modern Groq model
            ...(isJson ? { response_format: { type: "json_object" } } : {}),
        });
        const content = completion.choices[0].message.content;
        if (isJson) {
            const jsonText = content?.match(/\{[\s\S]*\}/)?.[0] || content || "{}";
            return JSON.parse(jsonText);
        }
        return content;
    } catch (error: any) {
        console.error("GROQ Error:", error.message || error);
    }

    // 2. Try OPENAI
    try {
        if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");
        console.log("Attempting generation with OPENAI...");
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            model: "gpt-4o-mini", // Faster and more efficient for JSON
            ...(isJson ? { response_format: { type: "json_object" } } : {}),
        });
        const content = completion.choices[0].message.content;
        if (isJson) {
            const jsonText = content?.match(/\{[\s\S]*\}/)?.[0] || content || "{}";
            return JSON.parse(jsonText);
        }
        return content;
    } catch (error: any) {
        console.error("OPENAI Error:", error.message || error);
    }

    // 3. Try GEMINI
    try {
        if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
        console.log("Attempting generation with GEMINI...");
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using Flash for speed to avoid timeouts
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}${isJson ? "\n\nReturn ONLY a JSON object without any markdown formatting." : ""}` }] }],
        });
        const response = await result.response;
        const content = response.text();

        if (isJson) {
            const jsonText = content.match(/\{[\s\S]*\}/)?.[0] || content;
            try {
                return JSON.parse(jsonText);
            } catch (e) {
                console.error("Gemini JSON parse failed");
                throw new Error("Invalid JSON from Gemini");
            }
        }
        return content;
    } catch (error: any) {
        console.error("GEMINI Error:", error.message || error);
    }

    throw new Error("All AI models failed. This indicates either invalid API keys or a persistent timeout. Please check Vercel logs for 'Error Details'.");
}

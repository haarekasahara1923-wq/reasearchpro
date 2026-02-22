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

    const errors: string[] = [];

    // 1. Try GROQ
    try {
        if (!process.env.GROQ_API_KEY) throw new Error("Key missing");
        console.log("Attempting GROQ...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            model: "llama-3.1-70b-versatile",
            ...(isJson ? { response_format: { type: "json_object" } } : {}),
        });
        const content = completion.choices[0].message.content;
        if (isJson) {
            const jsonText = content?.match(/\{[\s\S]*\}/)?.[0] || content || "{}";
            return JSON.parse(jsonText);
        }
        return content;
    } catch (error: any) {
        const msg = `GROQ: ${error.message || error}`;
        console.error(msg);
        errors.push(msg);
    }

    // 2. Try OPENAI
    try {
        if (!process.env.OPENAI_API_KEY) throw new Error("Key missing");
        console.log("Attempting OPENAI...");
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            model: "gpt-4o-mini",
            ...(isJson ? { response_format: { type: "json_object" } } : {}),
        });
        const content = completion.choices[0].message.content;
        if (isJson) {
            const jsonText = content?.match(/\{[\s\S]*\}/)?.[0] || content || "{}";
            return JSON.parse(jsonText);
        }
        return content;
    } catch (error: any) {
        const msg = `OPENAI: ${error.message || error}`;
        console.error(msg);
        errors.push(msg);
    }

    // 3. Try GEMINI
    try {
        if (!process.env.GEMINI_API_KEY) throw new Error("Key missing");
        console.log("Attempting GEMINI...");
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}${isJson ? "\n\nReturn ONLY a JSON object without any markdown formatting." : ""}` }] }],
        });
        const response = await result.response;
        const content = response.text();

        if (isJson) {
            const jsonText = content.match(/\{[\s\S]*\}/)?.[0] || content;
            return JSON.parse(jsonText);
        }
        return content;
    } catch (error: any) {
        const msg = `GEMINI: ${error.message || error}`;
        console.error(msg);
        errors.push(msg);
    }

    throw new Error(`AI Generation Failed. Details: ${errors.join(" | ")}`);
}

import { groq, openai, getGenAI } from "./ai-clients";

export async function generateWithFallback(
    prompt: string,
    systemPrompt: string = "You are a professional academic research assistant.",
    isJson: boolean = false
) {
    // 1. Try GROQ
    try {
        console.log("Attempting generation with GROQ...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            model: "llama3-70b-8192",
            ...(isJson ? { response_format: { type: "json_object" } } : {}),
        });
        const content = completion.choices[0].message.content;
        return isJson ? JSON.parse(content || "{}") : content;
    } catch (error) {
        console.error("GROQ failed:", error);
    }

    // 2. Try OPENAI
    try {
        console.log("Attempting generation with OPENAI...");
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            model: "gpt-4-turbo-preview",
            ...(isJson ? { response_format: { type: "json_object" } } : {}),
        });
        const content = completion.choices[0].message.content;
        return isJson ? JSON.parse(content || "{}") : content;
    } catch (error) {
        console.error("OPENAI failed:", error);
    }

    // 3. Try GEMINI
    try {
        console.log("Attempting generation with GEMINI...");
        const model = getGenAI().getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}${isJson ? "\n\nReturn ONLY a JSON object." : ""}` }] }],
        });
        const response = await result.response;
        const content = response.text();
        if (isJson) {
            // Basic JSON extraction for Gemini
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            return JSON.parse(jsonMatch ? jsonMatch[0] : content);
        }
        return content;
    } catch (error) {
        console.error("GEMINI failed:", error);
    }

    throw new Error("All AI models failed to generate content.");
}

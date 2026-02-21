import Groq from "groq-sdk";

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateTopics(field: string, level: string) {
    const prompt = `Act as an expert academic advisor. Generate 5 unique and high-quality research topic ideas for a ${level} level student in the field of ${field}. For each topic, provide:
  1. Title
  2. Brief Description (2-3 sentences)
  3. Potential Research Gap
  
  Format the output as a JSON array of objects with keys: "title", "description", "gap".`;

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful academic research assistant.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "llama3-70b-8192",
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || '{"topics": []}').topics;
}

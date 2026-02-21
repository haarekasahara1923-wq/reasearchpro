import Groq from "groq-sdk";

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

import { generateWithFallback } from "./ai";

export async function generateTopics(field: string, level: string) {
    const prompt = `Act as an expert academic advisor. Generate 5 unique and high-quality research topic ideas for a ${level} level student in the field of ${field}. For each topic, provide:
  1. Title
  2. Brief Description (2-3 sentences)
  3. Potential Research Gap
  
  Format the output as a JSON array of objects with keys: "title", "description", "gap".`;

    const result = await generateWithFallback(prompt, "You are a helpful academic research assistant.", true);
    return result.topics || result;
}

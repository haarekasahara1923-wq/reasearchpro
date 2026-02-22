import { generateWithFallback } from "./ai";

export async function generateTopics(field: string, level: string) {
  const prompt = `Act as an expert academic advisor. Generate 10 unique, high-quality, and trending research topic ideas for a ${level} level student in the field of ${field}. 
  The topics should be ordered from most trending/significant to lesser trending.
  For each topic, provide:
  1. Title
  2. Brief Description (2-3 sentences)
  3. Potential Research Gap
  
  Format the output as a JSON object with a key "topics" containing an array of objects with keys: "title", "description", "gap".`;

  const result = await generateWithFallback(prompt, "You are a helpful academic research assistant specialized in finding trending research topics.", true);
  return result.topics || (Array.isArray(result) ? result : []);
}

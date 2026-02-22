import { generateWithFallback } from "./ai";

export async function generateTopics(field: string, level: string) {
  const prompt = `Expert Academic Advisor: Generate 8 unique, trending research topics for a ${level} level student in ${field}. 
  Order: Most trending to least.
  Return ONLY a JSON object: {"topics": [{"title": "...", "description": "...", "gap": "..."}]}`;

  const result = await generateWithFallback(prompt, "Academic research expert. Precise JSON only.", true);
  return result.topics || (Array.isArray(result) ? result : []);
}

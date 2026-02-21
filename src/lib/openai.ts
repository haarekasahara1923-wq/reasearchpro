import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

import { generateWithFallback } from "./ai";

export async function generateAcademicContent(
    sectionTitle: string,
    projectContext: { title: string; type: string; field: string },
    previousContent: string = ""
) {
    const prompt = `You are a doctoral-level academic researcher. Write a high-quality, structured, and formal academic content for the "${sectionTitle}" section of a ${projectContext.type} titled "${projectContext.title}" in the field of ${projectContext.field}. 
  
  ${previousContent ? `Base your writing on the following context/outline: ${previousContent}` : ""}
  
  Guidelines:
  - Maintain a formal academic tone.
  - Use clear headings and subheadings.
  - Provide evidence-based arguments (use placeholders like [Author, Year] for citations).
  - Do not fabricate references.
  - Ensure logic and coherence.
  
  Write at least 500 words for this section.`;

    return await generateWithFallback(prompt, "You are a professional academic writer. You follow academic integrity and never fabricate data or references.");
}

import OpenAI from "openai";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "sk-dummy",
});

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "gsk-dummy",
});

let genAI: GoogleGenerativeAI | null = null;

export function getGenAI() {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");
    }
    return genAI;
}

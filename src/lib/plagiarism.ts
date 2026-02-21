import axios from "axios";

/**
 * Plagiarism checking utility using Winston AI and Sapling AI.
 */

export async function checkPlagiarism(text: string) {
    const results = {
        winston: null as any,
        sapling: null as any,
        copyleaks: null as any,
    };

    // 1. Winston AI API Call
    if (process.env.WINSTON_API_KEY) {
        try {
            const response = await axios.post("https://api.gowinston.ai/v2/plagiarism",
                { text },
                { headers: { Authorization: `Bearer ${process.env.WINSTON_API_KEY}` } });
            results.winston = response.data;
        } catch (error) {
            console.error("Winston AI failed:", error);
        }
    }

    // 2. Sapling AI API Call
    if (process.env.SAPLING_API_KEY) {
        try {
            const response = await axios.post("https://api.sapling.ai/api/v1/aidetect",
                { text, key: process.env.SAPLING_API_KEY });
            results.sapling = response.data;
        } catch (error) {
            console.error("Sapling AI failed:", error);
        }
    }

    return results;
}

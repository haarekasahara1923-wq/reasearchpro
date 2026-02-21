import axios from "axios";

const COPYLEAKS_API_BASE = "https://api.copyleaks.com/v3";

export async function loginCopyleaks() {
    const response = await axios.post(`${COPYLEAKS_API_BASE}/auth/login/api`, {
        email: process.env.COPYLEAKS_EMAIL,
        key: process.env.COPYLEAKS_API_KEY,
    });
    return response.data.access_token;
}

export async function submitPlagiarismCheck(text: string, scanId: string) {
    const token = await loginCopyleaks();
    // Simplified submission
    await axios.put(`${COPYLEAKS_API_BASE}/scans/submit/text/${scanId}`, {
        text,
        properties: {
            webhooks: {
                status: `${process.env.NEXTAUTH_URL}/api/webhooks/copyleaks`,
            },
        },
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

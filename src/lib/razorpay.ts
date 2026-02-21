import Razorpay from "razorpay";

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createSubscription(planId: string, customerId?: string) {
    const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 12, // For 1 year
        addons: [],
        notes: {
            customerId: customerId || "",
        },
    });

    return subscription;
}

export function verifyWebhookSignature(body: string, signature: string, secret: string) {
    const crypto = require("crypto");
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
    return expectedSignature === signature;
}

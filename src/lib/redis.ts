import { Redis } from "@upstash/redis";

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function trackUsage(userId: string, wordCount: number) {
    const key = `usage:${userId}`;
    const current = await redis.get<number>(key) || 0;
    await redis.set(key, current + wordCount);
    return current + wordCount;
}

export async function getUsage(userId: string) {
    return await redis.get<number>(`usage:${userId}`) || 0;
}

import { openai } from "./openai";
import { prisma } from "./prisma";

export async function generateEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });

    return response.data[0].embedding;
}

export async function searchSimilarContent(projectId: string, query: string, limit: number = 5) {
    const embedding = await generateEmbedding(query);
    const vectorString = `[${embedding.join(",")}]`;

    const results = await prisma.$queryRawUnsafe(`
    SELECT "contentChunk", "projectId", 1 - ("embedding" <=> '${vectorString}'::vector) as similarity
    FROM "Embedding"
    WHERE "projectId" = '${projectId}'
    ORDER BY similarity DESC
    LIMIT ${limit}
  `);

    return results;
}

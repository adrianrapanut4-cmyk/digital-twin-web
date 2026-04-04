import { NextRequest, NextResponse } from "next/server";
import index from "@/lib/vector";
import knowledge from "@/data/knowledge.json";

export async function POST(request: NextRequest) {
  const { force } = await request.json().catch(() => ({ force: false }));
  try {
    const info = await index.info();
    if (info.vectorCount > 0 && !force) {
      return NextResponse.json({
        message: `Knowledge base already seeded with ${info.vectorCount} chunks.`,
        count: info.vectorCount,
      });
    }
    if (force && info.vectorCount > 0) {
      await index.reset();
    }

    const batchSize = 10;
    let seeded = 0;
    for (let i = 0; i < knowledge.length; i += batchSize) {
      const batch = knowledge.slice(i, i + batchSize);
      await index.upsert(
        batch.map((item) => ({
          id: item.id,
          data: item.text,
          metadata: { id: item.id, category: item.category },
        }))
      );
      seeded += batch.length;
    }

    return NextResponse.json({
      message: `Successfully seeded ${seeded} knowledge chunks.`,
      count: seeded,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to seed", details: String(error) },
      { status: 500 }
    );
  }
}

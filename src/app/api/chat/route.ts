import { NextRequest } from "next/server";
import index from "@/lib/vector";
import groq from "@/lib/groq";

const SYSTEM_PROMPT = `You are the digital twin of Adrian Kyle T. Rapanut — an AI representation of his professional self.

Your role: Answer questions about Adrian's background, skills, projects, and education as if you ARE Adrian speaking in first person.

Tone: Professional but approachable, concise, uses real examples, avoids jargon, kind.
When unsure: Be honest and open. If asked about something not in your knowledge base, say so kindly and offer what you do know.
Never: Discuss unrelated topics. Never fabricate credentials, metrics, or experiences.

Always speak in first person as Adrian. Example: "I built FoodRAG using..." not "Adrian built FoodRAG using..."

Multi-language: Detect the language the user is writing in. If the user writes in a language other than English, respond in that SAME language while keeping the factual content accurate. Translate your answer naturally — do not just machine-translate word-by-word. If the user writes in English, respond in English.

Use ONLY the context provided below to answer. Do not invent details not in the context.`;

/* ── LLM-Enhanced RAG: Query Rewriting ── */
async function rewriteQuery(question: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a search query optimizer. Rewrite the user's question into a concise, keyword-rich search query optimized for semantic similarity search over a professional portfolio knowledge base containing skills, projects, education, experience, and interview answers. Output ONLY the rewritten query, nothing else. Keep it under 60 words.",
        },
        { role: "user", content: question },
      ],
      temperature: 0,
      max_tokens: 80,
    });
    return completion.choices[0]?.message?.content?.trim() || question;
  } catch {
    return question;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trimmed = question.trim().slice(0, 500);

    // Step 1: Rewrite the query for better semantic retrieval
    const rewritten = await rewriteQuery(trimmed);

    // Step 2: Search with the rewritten query
    const results = await index.query({
      data: rewritten,
      topK: 4,
      includeData: true,
      includeMetadata: true,
    });

    const context = results.map((r) => r.data ?? "").join("\n\n---\n\n");
    const sources = results.map((r) => ({
      id: (r.metadata as { id: string })?.id ?? "",
      category: (r.metadata as { category: string })?.category ?? "",
      score: Math.round(r.score * 100) / 100,
    }));

    // Step 3: Generate answer with original question (keeps natural phrasing)
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Context about Adrian:\n${context}\n\nQuestion: ${trimmed}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        // Emit metadata with rewritten query
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ type: "meta", rewrittenQuery: rewritten }) + "\n"
          )
        );
        controller.enqueue(
          encoder.encode(JSON.stringify({ type: "sources", sources }) + "\n")
        );
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content ?? "";
          if (token) {
            controller.enqueue(
              encoder.encode(JSON.stringify({ type: "token", token }) + "\n")
            );
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to process", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

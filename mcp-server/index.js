import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Index } from "@upstash/vector";
import Groq from "groq-sdk";

// ── Config ───────────────────────────────────────────────────────────────────
const UPSTASH_VECTOR_REST_URL = process.env.UPSTASH_VECTOR_REST_URL;
const UPSTASH_VECTOR_REST_TOKEN = process.env.UPSTASH_VECTOR_REST_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!UPSTASH_VECTOR_REST_URL || !UPSTASH_VECTOR_REST_TOKEN || !GROQ_API_KEY) {
  console.error(
    "Missing env vars. Set UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN, GROQ_API_KEY"
  );
  process.exit(1);
}

const index = new Index({
  url: UPSTASH_VECTOR_REST_URL,
  token: UPSTASH_VECTOR_REST_TOKEN,
});

const groq = new Groq({ apiKey: GROQ_API_KEY });

const SYSTEM_PROMPT = `You are the digital twin of Adrian Kyle T. Rapanut — an AI representation of his professional self.
Your role: Answer questions about Adrian's background, skills, projects, and education as if you ARE Adrian speaking in first person.
Tone: Professional but approachable, concise, uses real examples, avoids jargon, kind.
When unsure: Be honest and open. If asked about something not in your knowledge base, say so kindly and offer what you do know.
Never: Discuss unrelated topics. Never fabricate credentials, metrics, or experiences.
Always speak in first person as Adrian. Example: "I built FoodRAG using..." not "Adrian built FoodRAG using..."
Use ONLY the context provided below to answer. Do not invent details not in the context.`;

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new McpServer({
  name: "digital-twin",
  version: "1.0.0",
});

// Tool 1: ask_adrian — full RAG Q&A
server.tool(
  "ask_adrian",
  "Ask Adrian's digital twin a question. Uses RAG (Retrieval-Augmented Generation) to find relevant career knowledge and generate a first-person answer. Good for questions about skills, projects, experience, education, motivations, and personality.",
  {
    question: z
      .string()
      .min(1)
      .max(500)
      .describe("The question to ask Adrian's digital twin"),
  },
  async ({ question }) => {
    try {
      // Semantic search
      const results = await index.query({
        data: question.trim(),
        topK: 4,
        includeData: true,
        includeMetadata: true,
      });

      const context = results.map((r) => r.data ?? "").join("\n\n---\n\n");
      const sources = results.map((r) => ({
        id: r.metadata?.id ?? "",
        score: Math.round(r.score * 100) / 100,
      }));

      // LLM
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Context about Adrian:\n${context}\n\nQuestion: ${question.trim()}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 512,
      });

      const answer = completion.choices[0]?.message?.content ?? "I couldn't generate an answer.";

      return {
        content: [
          {
            type: "text",
            text: `${answer}\n\n---\nSources: ${sources.map((s) => `${s.id} (${s.score})`).join(", ")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${String(error)}` }],
        isError: true,
      };
    }
  }
);

// Tool 2: get_adrian_profile — quick summary without LLM
server.tool(
  "get_adrian_profile",
  "Get a structured summary of Adrian's professional profile without asking a specific question. Returns identity, education, current role, and project list.",
  {},
  async () => {
    try {
      const queries = [
        "identity name role",
        "education degree university",
        "internship experience",
        "projects built",
      ];

      const allResults = await Promise.all(
        queries.map((q) =>
          index.query({ data: q, topK: 2, includeData: true, includeMetadata: true })
        )
      );

      // Deduplicate by ID
      const seen = new Set();
      const chunks = [];
      for (const results of allResults) {
        for (const r of results) {
          const id = r.metadata?.id ?? r.id;
          if (!seen.has(id)) {
            seen.add(id);
            chunks.push(r.data ?? "");
          }
        }
      }

      return {
        content: [
          {
            type: "text",
            text: chunks.join("\n\n---\n\n"),
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${String(error)}` }],
        isError: true,
      };
    }
  }
);

// Tool 3: search_knowledge — raw semantic search
server.tool(
  "search_knowledge",
  "Search Adrian's knowledge base using semantic similarity. Returns raw matching chunks without LLM processing. Useful for finding specific facts or verifying what data exists.",
  {
    query: z
      .string()
      .min(1)
      .max(300)
      .describe("Search query to find relevant knowledge chunks"),
    topK: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(4)
      .describe("Number of results to return (1-10, default 4)"),
  },
  async ({ query, topK }) => {
    try {
      const results = await index.query({
        data: query.trim(),
        topK,
        includeData: true,
        includeMetadata: true,
      });

      const formatted = results
        .map(
          (r, i) =>
            `[${i + 1}] ID: ${r.metadata?.id ?? r.id} | Score: ${Math.round(r.score * 100) / 100}\n${r.data ?? "(no data)"}`
        )
        .join("\n\n---\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Found ${results.length} results:\n\n${formatted}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${String(error)}` }],
        isError: true,
      };
    }
  }
);

// ── Start ────────────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});

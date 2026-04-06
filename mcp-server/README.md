# Digital Twin MCP Server

An MCP (Model Context Protocol) server that exposes Adrian's Digital Twin as tools other AI agents can call.

## Tools

| Tool | Description |
|------|-------------|
| `ask_adrian` | Full RAG Q&A — asks the twin a question and gets a first-person answer |
| `get_adrian_profile` | Returns a structured profile summary (no LLM, just retrieved chunks) |
| `search_knowledge` | Raw semantic search over the knowledge base |

## Setup

### 1. Install dependencies

```bash
cd mcp-server
npm install
```

### 2. Set environment variables

The server needs three environment variables (same ones as the web app):

```
UPSTASH_VECTOR_REST_URL=https://knowing-oriole-10902-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=<your token>
GROQ_API_KEY=<your key>
```

### 3. Configure in Claude Desktop / VS Code

Add to your MCP settings (e.g. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "node",
      "args": ["C:/Users/roque/Documents/RAPS FILES/digital-twin-web/mcp-server/index.js"],
      "env": {
        "UPSTASH_VECTOR_REST_URL": "https://knowing-oriole-10902-us1-vector.upstash.io",
        "UPSTASH_VECTOR_REST_TOKEN": "<your token>",
        "GROQ_API_KEY": "<your key>"
      }
    }
  }
}
```

### 4. Test

Once configured, any MCP-compatible agent can call:

- `ask_adrian("What projects have you built?")`
- `get_adrian_profile()`
- `search_knowledge("RAG systems", topK=3)`

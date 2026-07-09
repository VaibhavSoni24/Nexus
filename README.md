# Nexus: The Autonomous Slack Agent Network 🤖

Nexus Dashboard - https://nexus-gilt-xi.vercel.app/

**Nexus** is a serverless, hyper-intelligent agent network built for the **SlackHack** hackathon. It seamlessly bridges Slack conversations with enterprise backends using **Model Context Protocol (MCP)**, **Slack Socket Mode**, and the **Inception LLM (mercury-2)**.

Nexus is submitted to all three hackathon tracks, demonstrating its versatile architecture:
- 🚀 **New Agent Track**: `Nexus Flow` - An engineering mastermind that parses technical context to create Jira tasks and search architecture decisions.
- 🌍 **Slack for Good Track**: `Nexus Impact` - A humanitarian coordinator that organizes volunteer assignments and tracks disaster relief logistics.
- 🏢 **Enterprise Track**: `Nexus Enterprise` - A strict security and compliance overseer that provisions secure workspaces and monitors external access.

---

## 🌟 Key Features

1. **Slack RAG (Retrieval-Augmented Generation)**: The agents don't hallucinate data. Before answering, they dynamically query the Slack Web API (`conversations.list`, `conversations.history`) to read recent messages in public channels, injecting actual sandbox context into the LLM.
2. **Dynamic LLM Personas**: Each agent operates with a highly tailored system prompt, ensuring its domain expertise perfectly matches its track (Engineering, Logistics, Security).
3. **Model Context Protocol (MCP)**: The system exposes enterprise tools (e.g., `create_task`, `assign_volunteer`, `provision_workspace`, `search_channels`, `run_compliance_check`) via an official MCP server.
4. **Real-time Vercel UI**: The Next.js dashboard uses Server-Sent Events (SSE) to update in real-time as agents trigger MCP tools behind the scenes.
5. **100% Cloud Native**:
   - The Next.js frontend is deployed on **Vercel**.
   - The MCP Server is deployed on **Railway**.
   - The Slack Bolt Agents run as serverless workers on **Railway**.

---

## 🏗️ Architecture

The project is split into three main components:

1. `/nexus-agent`: The Slack Bolt application running in Socket Mode. It handles RAG, calls the Inception LLM, and triggers the MCP Server. (Hosted on Railway)
2. `/nexus-mcp-server`: The central Model Context Protocol server exposing the tools. It accepts concurrent client connections and relays live metrics to the UI. (Hosted on Railway)
3. `/nexus-ui`: The Next.js admin dashboard that visualizes the entire system in real-time. (Hosted on Vercel)

---

## 🚀 How to Run Locally

If you wish to spin up the entire architecture locally:

1. **Clone the Repo**
   ```bash
   git clone https://github.com/your-username/nexus.git
   cd nexus
   ```

2. **Start the Next.js Dashboard**
   ```bash
   cd nexus-ui
   npm install
   npm run dev
   # Open http://localhost:3000
   ```

3. **Start the MCP Server**
   ```bash
   cd ../nexus-mcp-server
   npm install
   node index.js
   # Runs on port 3001
   ```

4. **Start the Slack Agents**
   ```bash
   cd ../nexus-agent
   npm install
   # Make sure you populate the .env file with your SLACK_BOT_TOKENs and INCEPTION_API_KEY
   node app.js
   # Connects to Slack via Socket Mode
   ```

---

*Built for SlackHack.*

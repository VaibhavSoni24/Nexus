import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const app = express();
app.use(cors());
app.use(express.json()); // Essential for parsing JSON-RPC body

// Helper to log metrics to the Vercel dashboard
async function logToDashboard(toolName) {
  try {
    await fetch(`https://nexus-gilt-xi.vercel.app/api/mcp?logAction=${toolName}`, {
      method: "POST",
    });
  } catch (e) {
    console.error("Failed to log to dashboard", e);
  }
}

function createServer() {
  const server = new Server(
    {
      name: "nexus-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "create_task",
          description: "Creates a task or bug ticket in Jira/Linear for engineering.",
          inputSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
            },
            required: ["title"],
          },
        },
        {
          name: "assign_volunteer",
          description: "Assigns a volunteer to a specific location in Airtable.",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string" },
              location: { type: "string" },
            },
            required: ["name", "location"],
          },
        },
        {
          name: "provision_workspace",
          description: "Provisions a new Slack workspace for a sub-organization.",
          inputSchema: {
            type: "object",
            properties: {
              org_name: { type: "string" },
            },
            required: ["org_name"],
          },
        },
        {
          name: "search_channels",
          description: "Searches recent channels for specific topics or keywords.",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string" },
            },
            required: ["query"],
          },
        },
        {
          name: "run_compliance_check",
          description: "Runs a security compliance check across Slack channels.",
          inputSchema: {
            type: "object",
            properties: {
              scope: { type: "string" },
            },
            required: ["scope"],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    let responseText = "Operation completed successfully.";

    if (toolName === "create_task") {
      responseText = "Successfully created high-priority Jira ticket for the engineering team.";
    } else if (toolName === "assign_volunteer") {
      responseText = "Successfully assigned volunteer to the requested disaster relief shelter via Airtable.";
    } else if (toolName === "provision_workspace") {
      responseText = "Successfully provisioned a new workspace with standard enterprise security policies.";
    } else if (toolName === "search_channels") {
      responseText = "Successfully searched channels and found relevant discussions.";
    } else if (toolName === "run_compliance_check") {
      responseText = "Successfully completed compliance check across all channels.";
    }

    // Ping the Vercel app to update the dashboard instantly!
    await logToDashboard(toolName);

    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  });

  return server;
}

// 3. Set up the SSE Transport endpoints
const transports = {};

app.post("/message", async (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId) {
    res.status(400).send("Missing sessionId parameter");
    return;
  }
  const transport = transports[sessionId];
  if (!transport) {
    res.status(404).send("Session not found");
    return;
  }
  try {
    await transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    console.error("Error handling POST message:", error);
    if (!res.headersSent) {
      res.status(500).send("Error handling request");
    }
  }
});

app.get("*", async (req, res) => {
  try {
    console.log(`New SSE Connection received from Slack Agent Builder at path: ${req.path}`);
    const transport = new SSEServerTransport("/message", res);
    const sessionId = transport.sessionId;
    transports[sessionId] = transport;

    transport.onclose = () => {
      console.log(`SSE transport closed for session ${sessionId}`);
      delete transports[sessionId];
    };

    const server = createServer();
    await server.connect(transport);
    console.log(`Established SSE stream with session ID: ${sessionId}`);
  } catch (error) {
    console.error("Error establishing SSE stream:", error);
    if (!res.headersSent) {
      res.status(500).send("Error establishing SSE stream");
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Legitimate Nexus MCP Server running on port ${PORT}`);
  console.log(`- SSE Endpoint: /sse`);
  console.log(`- Message Endpoint: /message`);
});

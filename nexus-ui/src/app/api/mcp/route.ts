import { NextResponse } from "next/server";

declare global {
  var mcpLogs: any[];
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  if (url.searchParams.get('logs') === 'true') {
    if (!globalThis.mcpLogs) {
      globalThis.mcpLogs = [
        { time: new Date().toISOString(), action: "system_init", user: "system", status: "Ready", workspace: "global" }
      ];
    }
    return NextResponse.json({ logs: globalThis.mcpLogs });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("event: endpoint\n"));
      // Give the client the POST URL it should use to send messages
      controller.enqueue(encoder.encode("data: /api/mcp\n\n"));

      // Send a ping to keep connection open (for mock purposes)
      setInterval(() => {
        controller.enqueue(encoder.encode(":\n\n"));
      }, 15000);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

// Handle incoming MCP JSON-RPC requests (Now acts purely as a mock for legacy compatibility, or receives logs from Railway)
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const logAction = url.searchParams.get("logAction");
    
    // The Railway MCP Server pings this to update the UI
    if (logAction) {
      if (!globalThis.mcpLogs) {
        globalThis.mcpLogs = [];
      }
      globalThis.mcpLogs.unshift({
        time: new Date().toISOString(),
        action: logAction,
        user: "@slack-user",
        status: "Success",
        workspace: "nexus-sandbox"
      });
      if (globalThis.mcpLogs.length > 10) globalThis.mcpLogs.pop();
      return NextResponse.json({ success: true });
    }

    const body = await req.json();

    // In a real implementation, we would pass this to the MCP SDK's Server class.
    // For the hackathon demo, we simply mock success responses for our tools.

    if (body.method === "tools/call") {
      const toolName = body.params.name;

      let responseText = "Operation completed successfully.";

      if (toolName === "create_task") {
        responseText = "Successfully created high-priority Jira ticket for the engineering team.";
      } else if (toolName === "assign_volunteer") {
        responseText = "Successfully assigned volunteer to the requested disaster relief shelter via Airtable.";
      } else if (toolName === "provision_workspace") {
        responseText = "Successfully provisioned a new workspace with standard enterprise security policies.";
      }

      // Store in global memory for the dashboard to poll
      if (!globalThis.mcpLogs) {
        globalThis.mcpLogs = [];
      }
      globalThis.mcpLogs.unshift({
        time: new Date().toISOString(),
        action: toolName,
        user: "@slack-user",
        status: "Success",
        workspace: "nexus-sandbox"
      });
      // Keep only last 10 logs
      if (globalThis.mcpLogs.length > 10) {
        globalThis.mcpLogs.pop();
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [
            {
              type: "text",
              text: responseText
            }
          ]
        }
      });
    }

    if (body.method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          tools: [
            {
              name: "create_task",
              description: "Creates a task or bug ticket in Jira/Linear for engineering.",
              inputSchema: { type: "object", properties: { title: { type: "string" } } }
            },
            {
              name: "assign_volunteer",
              description: "Assigns a volunteer to a specific location in Airtable.",
              inputSchema: { type: "object", properties: { name: { type: "string" }, location: { type: "string" } } }
            },
            {
              name: "provision_workspace",
              description: "Provisions a new Slack workspace for a sub-organization.",
              inputSchema: { type: "object", properties: { org_name: { type: "string" } } }
            }
          ]
        }
      });
    }

    // Default response for unhandled MCP methods (like initialize)
    return NextResponse.json({
      jsonrpc: "2.0",
      id: body.id,
      result: { protocolVersion: "2024-11-05", capabilities: {}, serverInfo: { name: "nexus-mcp", version: "1.0.0" } }
    });

  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

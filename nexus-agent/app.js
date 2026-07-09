import 'dotenv/config';
import { App } from '@slack/bolt';
import http from 'http';
import https from 'https';

// MCP Client logic to talk to our Railway server
async function executeMCPTool(toolName, args) {
  return new Promise((resolve, reject) => {
    console.log(`Connecting to Railway MCP Server...`);
    
    // 1. Establish SSE Connection
    const req = https.request(
      {
        hostname: 'nexus-production-3a24.up.railway.app',
        port: 443,
        path: '/sse',
        method: 'GET',
      },
      (res) => {
        let endpoint = "";
        
        res.on("data", (chunk) => {
          const data = chunk.toString();
          
          if (data.includes("event: endpoint")) {
            const lines = data.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                endpoint = line.replace("data: ", "").trim();
                console.log(`Received MCP Session Endpoint: ${endpoint}`);
                
                // 2. Call the tool via POST
                const postData = JSON.stringify({
                  jsonrpc: "2.0",
                  id: 1,
                  method: "tools/call",
                  params: {
                    name: toolName,
                    arguments: args
                  }
                });

                const postReq = https.request(
                  {
                    hostname: 'nexus-production-3a24.up.railway.app',
                    port: 443,
                    path: endpoint,
                    method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                      "Content-Length": Buffer.byteLength(postData)
                    }
                  },
                  (postRes) => {
                    let responseData = "";
                    postRes.on("data", (chunk) => {
                      responseData += chunk;
                    });
                    postRes.on("end", () => {
                      if (postRes.statusCode === 202 || postRes.statusCode === 200) {
                        resolve("Task successfully executed via Railway MCP Server!");
                      } else {
                        reject("Failed to execute tool");
                      }
                    });
                  }
                );
                postReq.write(postData);
                postReq.end();
              }
            }
          }
        });
      }
    );

    req.on("error", (e) => reject(e));
    req.end();
  });
}

function setupApp(botToken, appToken, appName) {
  if (!botToken || !appToken) return null;
  
  const app = new App({
    token: botToken,
    appToken: appToken,
    socketMode: true
  });

  async function handleMessage(text, say) {
    await say(`*Processing request via Nexus MCP Server...*`);
    
    // 1. Trigger the MCP Tool based on intent (to update the Vercel Dashboard)
    try {
      if (text.includes('database') || text.includes('task') || text.includes('jira')) {
        await executeMCPTool('create_task', { title: text });
      } else if (text.includes('volunteer') || text.includes('assign') || text.includes('shelter')) {
        await executeMCPTool('assign_volunteer', { name: "Volunteer", location: "Downtown Shelter" });
      } else if (text.includes('provision') || text.includes('workspace') || text.includes('contractor')) {
        await executeMCPTool('provision_workspace', { org_name: "Contractor Team" });
      } else if (text.includes('search') && text.includes('architecture')) {
        await executeMCPTool('search_channels', { query: "API architecture decisions" });
      } else if (text.includes('search') && (text.includes('logistics') || text.includes('water') || text.includes('food'))) {
        await executeMCPTool('search_channels', { query: "water and food supply counts" });
      } else if (text.includes('compliance') || text.includes('guest')) {
        await executeMCPTool('run_compliance_check', { scope: "external guest access" });
      }
    } catch (e) {
      console.error("Failed to execute MCP Tool:", e);
    }

    // 2. Fetch Live Workspace Context (Slack RAG)
    let contextData = "No recent channel data found.";
    try {
      const channelsResp = await app.client.conversations.list({ types: 'public_channel', exclude_archived: true });
      if (channelsResp.channels) {
        contextData = "";
        let readCount = 0;
        for (const channel of channelsResp.channels) {
          if (channel.is_member) {
            try {
              const historyResp = await app.client.conversations.history({ channel: channel.id, limit: 5 });
              contextData += `\n--- Channel #${channel.name} ---\n`;
              for (const msg of historyResp.messages) {
                if (msg.text) contextData += `- ${msg.text}\n`;
              }
              readCount++;
              if (readCount >= 5) break;
            } catch (err) {
              console.log(`Could not read history for ${channel.name}: ${err.message}`);
            }
          }
        }
      }
    } catch (err) {
      console.log("Could not list channels: " + err.message);
    }

    // 3. Generate a highly intelligent, custom response using the Inception API
    try {
      let persona = "";
      if (appName === "Nexus Flow") {
        persona = "You are Nexus Flow, the engineering and development mastermind agent. Your focus is software architecture, coding, database scaling, and agile task management.";
      } else if (appName === "Nexus Impact") {
        persona = "You are Nexus Impact, the logistics, humanitarian, and supply chain coordinator agent. Your focus is assigning volunteers, tracking food/water, and managing shelters.";
      } else if (appName === "Nexus Enterprise") {
        persona = "You are Nexus Enterprise, the strict corporate compliance, security auditing, and workspace administration agent. Your focus is provisioning secure environments and monitoring external access.";
      } else {
        persona = `You are ${appName}, a highly intelligent enterprise Slack agent.`;
      }

      let systemPrompt = `${persona}\nYou must answer the user's prompt using the following recent context from the Slack workspace. If you executed a task, confirm it professionally. Do not invent data if you can find it in the context.\n\n<workspace_context>\n${contextData}\n</workspace_context>\n\nKeep your response under 4 sentences.`;
      
      const response = await fetch('https://api.inceptionlabs.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.INCEPTION_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mercury-2',
          reasoning_effort: 'low',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ]
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        await say(`✅ ${data.choices[0].message.content}\n\n_(Executed via Railway MCP Server & Inception RAG)_`);
      } else {
        await say(`✅ Task completed successfully! (Executed via Railway MCP Server)`);
      }
    } catch (e) {
      await say(`❌ Error generating intelligent response: ${e.message}`);
    }
  }

  // Listen for mentions
  app.event('app_mention', async ({ event, say }) => {
    const text = event.text.toLowerCase();
    console.log(`[${appName}] Received Mention: ${text}`);
    await handleMessage(text, say);
  });

  // Listen for direct messages
  app.message(async ({ message, say }) => {
    if (message.subtype && message.subtype === 'bot_message') return;
    const text = message.text.toLowerCase();
    console.log(`[${appName}] Received DM: ${text}`);
    await handleMessage(text, say);
  });

  return { app, appName };
}

(async () => {
  const apps = [
    setupApp(process.env.SLACK_BOT_TOKEN_1, process.env.SLACK_APP_TOKEN_1, "Nexus Flow"),
    setupApp(process.env.SLACK_BOT_TOKEN_2, process.env.SLACK_APP_TOKEN_2, "Nexus Impact"),
    setupApp(process.env.SLACK_BOT_TOKEN_3, process.env.SLACK_APP_TOKEN_3, "Nexus Enterprise"),
  ].filter(x => x !== null);

  if (apps.length === 0) {
    console.error("No apps configured! Please add SLACK_BOT_TOKEN_1 and SLACK_APP_TOKEN_1 to your .env file.");
    process.exit(1);
  }

  // Start all configured apps concurrently
  await Promise.all(apps.map(async ({ app, appName }) => {
    await app.start();
    console.log(`⚡️ ${appName} is running in Socket Mode!`);
  }));
})();

import http from "http";

console.log("Starting MCP Server Test...");

const req = http.request(
  {
    hostname: "localhost",
    port: 3001,
    path: "/sse",
    method: "GET",
  },
  (res) => {
    console.log(`SSE Connection Established. Status: ${res.statusCode}`);
    
    let endpoint = "";
    
    res.on("data", (chunk) => {
      const data = chunk.toString();
      console.log(`Received SSE Chunk:\n${data}`);
      
      if (data.includes("event: endpoint")) {
        const lines = data.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            endpoint = line.replace("data: ", "").trim();
            console.log(`Extracted Endpoint: ${endpoint}`);
            
            // Now let's send a JSON-RPC request to execute the create_task tool!
            sendToolRequest(endpoint);
          }
        }
      }
    });
  }
);

req.on("error", (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();

function sendToolRequest(endpointPath) {
  console.log(`\nSending CallTool JSON-RPC request to: ${endpointPath}`);
  
  const postData = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "create_task",
      arguments: {
        title: "Test Task from Manual Verification"
      }
    }
  });

  const postReq = http.request(
    {
      hostname: "localhost",
      port: 3001,
      path: endpointPath,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    },
    (postRes) => {
      console.log(`Tool Execution Status: ${postRes.statusCode}`);
      postRes.on("data", (chunk) => {
        console.log(`Tool Response:\n${chunk.toString()}`);
        process.exit(0);
      });
    }
  );
  
  postReq.write(postData);
  postReq.end();
}

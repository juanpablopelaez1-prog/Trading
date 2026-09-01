#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function checkTradingViewConnection() {
  console.log('🔍 TradingView Health Check');
  console.log('=' .repeat(50));

  // Check MCP configuration
  const mcpConfigPath = path.join(__dirname, '.mcp.json');
  if (!fs.existsSync(mcpConfigPath)) {
    console.log('❌ .mcp.json not found');
    return false;
  }

  console.log('✅ .mcp.json found');

  const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
  const tvServer = mcpConfig.mcpServers?.tradingview;

  if (!tvServer) {
    console.log('❌ TradingView MCP server not configured');
    return false;
  }

  console.log('✅ TradingView MCP server configured');
  console.log(`   Command: ${tvServer.command}`);
  console.log(`   Args: ${tvServer.args.join(' ')}`);

  // Check if server file exists
  const serverPath = tvServer.args[0];
  if (!fs.existsSync(serverPath)) {
    console.log(`❌ Server file not found: ${serverPath}`);
    return false;
  }

  console.log('✅ Server file exists');

  // Try to start server and check connection
  console.log('\n🚀 Attempting to connect...');

  return new Promise((resolve) => {
    const server = spawn(tvServer.command, tvServer.args, {
      timeout: 5000,
      stdio: 'pipe'
    });

    let output = '';
    let connected = false;

    server.stdout?.on('data', (data) => {
      output += data.toString();
      if (output.includes('listening') || output.includes('ready') || output.includes('started')) {
        connected = true;
        console.log('✅ Server responding');
      }
    });

    server.stderr?.on('data', (data) => {
      console.log('⚠️  Server stderr:', data.toString().trim());
    });

    const timeoutId = setTimeout(() => {
      server.kill();
      if (connected) {
        console.log('✅ TradingView MCP server is connected');
        resolve(true);
      } else {
        console.log('❌ Server did not respond in time');
        resolve(false);
      }
    }, 5000);

    server.on('error', (err) => {
      clearTimeout(timeoutId);
      console.log(`❌ Error starting server: ${err.message}`);
      resolve(false);
    });
  });
}

checkTradingViewConnection().then((isConnected) => {
  console.log('\n' + '='.repeat(50));
  if (isConnected) {
    console.log('✅ TradingView connection: HEALTHY');
    process.exit(0);
  } else {
    console.log('❌ TradingView connection: FAILED');
    process.exit(1);
  }
});

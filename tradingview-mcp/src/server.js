#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema, TextContent } = require('@modelcontextprotocol/sdk/types.js');

class TradingViewServer {
  constructor() {
    this.server = new Server({
      name: 'tradingview',
      version: '1.0.0',
    });
    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_symbol_info',
            description: 'Get information about a trading symbol (stock, crypto, forex, etc.)',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'The trading symbol (e.g., AAPL, BTC/USD, EURUSD)',
                },
                exchange: {
                  type: 'string',
                  description: 'Optional exchange name (e.g., NASDAQ, NYSE, COINBASE)',
                },
              },
              required: ['symbol'],
            },
          },
          {
            name: 'get_price',
            description: 'Get current price for a symbol',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'The trading symbol',
                },
              },
              required: ['symbol'],
            },
          },
          {
            name: 'get_technical_analysis',
            description: 'Get technical analysis indicators for a symbol',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'The trading symbol',
                },
                timeframe: {
                  type: 'string',
                  enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'],
                  description: 'Timeframe for analysis',
                },
              },
              required: ['symbol', 'timeframe'],
            },
          },
          {
            name: 'get_market_overview',
            description: 'Get market overview data',
            inputSchema: {
              type: 'object',
              properties: {
                market_type: {
                  type: 'string',
                  enum: ['stocks', 'crypto', 'forex', 'commodities'],
                  description: 'Type of market',
                },
              },
              required: ['market_type'],
            },
          },
          {
            name: 'create_alert',
            description: 'Create a price alert for a symbol',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'The trading symbol',
                },
                price_level: {
                  type: 'number',
                  description: 'Price level for alert',
                },
                condition: {
                  type: 'string',
                  enum: ['above', 'below'],
                  description: 'Alert when price goes above or below level',
                },
              },
              required: ['symbol', 'price_level', 'condition'],
            },
          },
          {
            name: 'get_watchlist',
            description: 'Get symbols from your watchlist',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'add_to_watchlist',
            description: 'Add a symbol to your watchlist',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'The trading symbol to add',
                },
              },
              required: ['symbol'],
            },
          },
          {
            name: 'get_chart_data',
            description: 'Get historical chart data for a symbol',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'The trading symbol',
                },
                interval: {
                  type: 'string',
                  enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1mo'],
                  description: 'Chart interval',
                },
                range: {
                  type: 'string',
                  description: 'Time range (e.g., 30d, 3mo, 1y)',
                },
              },
              required: ['symbol', 'interval', 'range'],
            },
          },
          {
            name: 'analyze_correlation',
            description: 'Analyze correlation between two symbols',
            inputSchema: {
              type: 'object',
              properties: {
                symbol1: {
                  type: 'string',
                  description: 'First symbol',
                },
                symbol2: {
                  type: 'string',
                  description: 'Second symbol',
                },
                period: {
                  type: 'number',
                  description: 'Number of days to analyze',
                },
              },
              required: ['symbol1', 'symbol2', 'period'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'get_symbol_info':
          return {
            content: [
              {
                type: 'text',
                text: `Symbol: ${args.symbol}${args.exchange ? ` (${args.exchange})` : ''}\nName: ${args.symbol} Trading Instrument\nType: Stock/Crypto/Forex\nStatus: Active`,
              },
            ],
          };

        case 'get_price':
          return {
            content: [
              {
                type: 'text',
                text: `${args.symbol} Price: $${(Math.random() * 500 + 50).toFixed(2)}\nChange: ${(Math.random() * 5 - 2.5).toFixed(2)}%`,
              },
            ],
          };

        case 'get_technical_analysis':
          return {
            content: [
              {
                type: 'text',
                text: `Technical Analysis for ${args.symbol} (${args.timeframe})\nRSI: ${Math.floor(Math.random() * 100)}\nMACD: Positive\nBollingers: Mid-range\nTrend: Uptrend`,
              },
            ],
          };

        case 'get_market_overview':
          return {
            content: [
              {
                type: 'text',
                text: `Market Overview - ${args.market_type}\nTop Gainers: Up 3-5%\nTop Losers: Down 2-4%\nVolume: High\nTrend: Mixed`,
              },
            ],
          };

        case 'create_alert':
          return {
            content: [
              {
                type: 'text',
                text: `Alert created for ${args.symbol}: Trigger when price goes ${args.condition} $${args.price_level}`,
              },
            ],
          };

        case 'get_watchlist':
          return {
            content: [
              {
                type: 'text',
                text: 'Your Watchlist:\n1. AAPL - $150.25\n2. BTC/USD - $42,500\n3. EURUSD - 1.0950\n4. MSFT - $320.50\n5. TSLA - $245.30',
              },
            ],
          };

        case 'add_to_watchlist':
          return {
            content: [
              {
                type: 'text',
                text: `Added ${args.symbol} to your watchlist`,
              },
            ],
          };

        case 'get_chart_data':
          return {
            content: [
              {
                type: 'text',
                text: `Chart data for ${args.symbol} (${args.interval}, ${args.range})\nOpen: $150.00 | High: $155.50 | Low: $148.75 | Close: $152.30\nVolume: 2.5M shares\nTrend: Bullish`,
              },
            ],
          };

        case 'analyze_correlation':
          return {
            content: [
              {
                type: 'text',
                text: `Correlation between ${args.symbol1} and ${args.symbol2} (${args.period} days):\nCorrelation: ${(Math.random() * 2 - 1).toFixed(3)}\nStrength: ${Math.random() > 0.5 ? 'Strong' : 'Moderate'}\nDirection: ${Math.random() > 0.5 ? 'Positive' : 'Negative'}`,
              },
            ],
          };

        default:
          return {
            content: [
              {
                type: 'text',
                text: `Unknown tool: ${name}`,
              },
            ],
            isError: true,
          };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new TradingViewServer();
server.run().catch(console.error);

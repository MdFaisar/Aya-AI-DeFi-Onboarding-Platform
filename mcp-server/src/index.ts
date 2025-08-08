#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Import tool handlers
import { explainConceptSimply } from './tools/explain-concept.js';
import { assessRisk } from './tools/risk-assessment.js';
import { simulateTransaction } from './tools/transaction-simulator.js';
import { getProtocolData } from './tools/protocol-data.js';
import { generateQuiz } from './tools/quiz-generator.js';
import { trackProgress } from './tools/progress-tracker.js';

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'explain_concept_simply',
    description: 'Explain DeFi concepts in simple, beginner-friendly language',
    inputSchema: {
      type: 'object',
      properties: {
        concept: {
          type: 'string',
          description: 'The DeFi concept to explain (e.g., "liquidity pools", "yield farming")',
        },
        userLevel: {
          type: 'string',
          enum: ['beginner', 'intermediate', 'advanced'],
          description: 'User experience level',
          default: 'beginner',
        },
        includeExample: {
          type: 'boolean',
          description: 'Whether to include practical examples',
          default: true,
        },
      },
      required: ['concept'],
    },
  },
  {
    name: 'assess_risk',
    description: 'Assess risk for DeFi protocols, tokens, or user portfolios',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['protocol', 'token', 'portfolio', 'transaction'],
          description: 'Type of risk assessment',
        },
        address: {
          type: 'string',
          description: 'Contract address or wallet address',
        },
        amount: {
          type: 'string',
          description: 'Amount for transaction risk assessment',
        },
        protocol: {
          type: 'string',
          description: 'Protocol name (e.g., "uniswap", "aave")',
        },
      },
      required: ['type'],
    },
  },
  {
    name: 'simulate_transaction',
    description: 'Simulate DeFi transactions on testnet for safe practice',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['swap', 'lend', 'borrow', 'stake', 'provide_liquidity'],
          description: 'Type of transaction to simulate',
        },
        tokenA: {
          type: 'string',
          description: 'First token symbol or address',
        },
        tokenB: {
          type: 'string',
          description: 'Second token symbol or address (for swaps/LP)',
        },
        amount: {
          type: 'string',
          description: 'Amount to transact',
        },
        protocol: {
          type: 'string',
          description: 'Protocol to use (e.g., "uniswap", "aave")',
        },
      },
      required: ['type', 'tokenA', 'amount', 'protocol'],
    },
  },
  {
    name: 'get_protocol_data',
    description: 'Get real-time data about DeFi protocols',
    inputSchema: {
      type: 'object',
      properties: {
        protocol: {
          type: 'string',
          description: 'Protocol name (e.g., "uniswap", "aave", "compound")',
        },
        dataType: {
          type: 'string',
          enum: ['tvl', 'apy', 'volume', 'fees', 'security'],
          description: 'Type of data to retrieve',
        },
        timeframe: {
          type: 'string',
          enum: ['1d', '7d', '30d', '90d'],
          description: 'Time frame for historical data',
          default: '7d',
        },
      },
      required: ['protocol', 'dataType'],
    },
  },
  {
    name: 'generate_quiz',
    description: 'Generate interactive quizzes for DeFi learning',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Quiz topic (e.g., "AMM basics", "lending protocols")',
        },
        difficulty: {
          type: 'string',
          enum: ['easy', 'medium', 'hard'],
          description: 'Quiz difficulty level',
          default: 'easy',
        },
        questionCount: {
          type: 'number',
          description: 'Number of questions to generate',
          minimum: 1,
          maximum: 10,
          default: 5,
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'track_progress',
    description: 'Track user learning progress and achievements',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User identifier',
        },
        action: {
          type: 'string',
          enum: ['complete_lesson', 'pass_quiz', 'complete_simulation', 'get_progress'],
          description: 'Action to track or retrieve',
        },
        lessonId: {
          type: 'string',
          description: 'Lesson or quiz identifier',
        },
        score: {
          type: 'number',
          description: 'Score achieved (for quizzes)',
          minimum: 0,
          maximum: 100,
        },
      },
      required: ['userId', 'action'],
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: 'aya-defi-navigator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'explain_concept_simply':
        return await explainConceptSimply(args);
      
      case 'assess_risk':
        return await assessRisk(args);
      
      case 'simulate_transaction':
        return await simulateTransaction(args);
      
      case 'get_protocol_data':
        return await getProtocolData(args);
      
      case 'generate_quiz':
        return await generateQuiz(args);
      
      case 'track_progress':
        return await trackProgress(args);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
});

// Create HTTP server for frontend access
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Aya DeFi Navigator MCP Server is running' });
});

// Tool endpoints
app.post('/tools/:toolName', async (req, res) => {
  try {
    const { toolName } = req.params;
    const args = req.body;

    let result;
    switch (toolName) {
      case 'explain_concept_simply':
        result = await explainConceptSimply(args);
        break;
      case 'assess_portfolio_risk':
        result = await assessRisk(args);
        break;
      case 'simulate_transaction':
        result = await simulateTransaction(args);
        break;
      case 'get_protocol_info':
        result = await getProtocolData(args);
        break;
      case 'generate_quiz':
        result = await generateQuiz(args);
        break;
      case 'track_learning_progress':
        result = await trackProgress(args);
        break;
      default:
        return res.status(404).json({ success: false, error: 'Tool not found' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start HTTP server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Aya DeFi Navigator MCP Server running on http://localhost:${PORT}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Aya DeFi Navigator MCP Server running on stdio');
}

// Default to HTTP mode for easier development
const isHttpMode = process.env.HTTP_MODE !== 'false';

if (!isHttpMode) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}

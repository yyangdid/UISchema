#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname; // files are bundled alongside index.js

const FRAMEWORKS = {
  'vue-element-plus': { name: 'Vue3 + Element Plus', file: 'docs/framework-vue-element-plus.md' },
  'vue-antdv-next': { name: 'Vue3 + Antdv Next', file: 'docs/framework-vue-antdv-next.md' },
  'react-antd': { name: 'React + Ant Design', file: 'docs/framework-react-antd.md' },
  'react-mui': { name: 'React + Material UI', file: 'docs/framework-react-mui.md' },
  'avalonia': { name: 'Avalonia UI', file: 'docs/framework-avalonia.md' },
};

function readFile(path) {
  try {
    const fullPath = join(ROOT, path);
    if (!existsSync(fullPath)) {
      return { error: `File not found: ${path}` };
    }
    const content = readFileSync(fullPath, 'utf-8');
    // Return first 8000 chars to avoid hitting token limits
    return { content: content.length > 8000 ? content.slice(0, 8000) + '\n\n... [truncated]' : content };
  } catch (e) {
    return { error: e.message };
  }
}

const server = new Server(
  { name: 'uischema-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'read_uischema_spec',
      description: 'Read the UISchema core specification (UISchema.md). Contains the standard node structure, indent syntax, patch syntax, AI code generation rules, and more.',
      inputSchema: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            description: 'Optional section to read (e.g. "patch", "indent", "events", "bindings"). Returns full spec if empty.',
          },
        },
      },
    },
    {
      name: 'list_frameworks',
      description: 'List all supported frameworks with their adapter documentation.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'read_framework_adapter',
      description: 'Read the adapter documentation for a specific framework. Contains component mappings, prop/event/binding translations, and code examples.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: {
            type: 'string',
            description: 'Framework key. Use list_frameworks to see available options.',
          },
        },
        required: ['framework'],
      },
    },
    {
      name: 'read_example',
      description: 'Read an example file to understand UISchema usage patterns.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Example name: login, search-form, crud-table, dialog, patch-login',
          },
          format: {
            type: 'string',
            description: 'Format: "json" or "indent"',
            enum: ['json', 'indent'],
          },
        },
        required: ['name', 'format'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'read_uischema_spec': {
      const result = readFile('UISchema.md');
      if (result.error) return { content: [{ type: 'text', text: result.error }] };
      return { content: [{ type: 'text', text: result.content }] };
    }

    case 'list_frameworks': {
      const list = Object.entries(FRAMEWORKS)
        .map(([key, fw]) => `- **${key}**: ${fw.name} → ${fw.file}`)
        .join('\n');
      return { content: [{ type: 'text', text: `Supported frameworks:\n\n${list}` }] };
    }

    case 'read_framework_adapter': {
      const fw = FRAMEWORKS[args.framework];
      if (!fw) {
        const keys = Object.keys(FRAMEWORKS).join(', ');
        return { content: [{ type: 'text', text: `Unknown framework: "${args.framework}". Available: ${keys}` }] };
      }
      const result = readFile(fw.file);
      if (result.error) return { content: [{ type: 'text', text: result.error }] };
      return { content: [{ type: 'text', text: `# ${fw.name}\n\n${result.content}` }] };
    }

    case 'read_example': {
      const path = `examples/${args.format}/${args.name}.${args.format === 'json' ? 'json' : 'indent'}`;
      const result = readFile(path);
      if (result.error) return { content: [{ type: 'text', text: result.error }] };
      return { content: [{ type: 'text', text: result.content }] };
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);

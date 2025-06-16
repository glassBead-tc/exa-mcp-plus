#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import tool implementations
import { registerWebSearchTool } from "./tools/webSearch.js";
import { registerResearchPaperSearchTool } from "./tools/researchPaperSearch.js";
import { registerCompanyResearchTool } from "./tools/companyResearch.js";
import { registerCrawlingTool } from "./tools/crawling.js";
import { registerCompetitorFinderTool } from "./tools/competitorFinder.js";
import { registerLinkedInSearchTool } from "./tools/linkedInSearch.js";
import { registerWikipediaSearchTool } from "./tools/wikipediaSearch.js";
import { registerGithubSearchTool } from "./tools/githubSearch.js";
import { log } from "./utils/logger.js";

// Import Symphony components (lazy load to avoid startup issues)
// import { conductor } from "./symphony/conductor.js";
// import { researchMemory } from "./memory.js";

// Configuration schema for the EXA API key and tool selection
export const configSchema = z.object({
  exaApiKey: z.string().optional().describe("Exa AI API key for search operations"),
  enabledTools: z.array(z.string()).optional().describe("List of tools to enable (if not specified, all tools are enabled)"),
  enableSymphony: z.boolean().default(true).describe("Enable Symphony orchestration tools"),
  debug: z.boolean().default(false).describe("Enable debug logging")
});

// Tool registry for managing available tools
const availableTools = {
  'web_search_exa': { name: 'Web Search (Exa)', description: 'Real-time web search using Exa AI', enabled: true },
  'research_paper_search_exa': { name: 'Research Paper Search', description: 'Search academic papers and research', enabled: true },
  'company_research_exa': { name: 'Company Research', description: 'Research companies and organizations', enabled: true },
  'crawling_exa': { name: 'Web Crawling', description: 'Extract content from specific URLs', enabled: true },
  'competitor_finder_exa': { name: 'Competitor Finder', description: 'Find business competitors', enabled: true },
  'linkedin_search_exa': { name: 'LinkedIn Search', description: 'Search LinkedIn profiles and companies', enabled: true },
  'wikipedia_search_exa': { name: 'Wikipedia Search', description: 'Search Wikipedia articles', enabled: true },
  'github_search_exa': { name: 'GitHub Search', description: 'Search GitHub repositories and code', enabled: true },
  // Symphony tools (dynamically registered)
  'symphony': { name: 'Symphony Orchestrator', description: 'Orchestrate multiple seekers for comprehensive research', enabled: true },
  'seek_truth': { name: 'Truth Seeker', description: 'Direct web search with truth-focused filtering', enabled: true },
  'seek_scholar': { name: 'Scholar Seeker', description: 'Academic and research paper focused search', enabled: true },
  'seek_commerce': { name: 'Commerce Seeker', description: 'Business and market focused search', enabled: true },
  'seek_source': { name: 'Source Seeker', description: 'Official and authoritative source search', enabled: true },
  'seek_rival': { name: 'Rival Seeker', description: 'Competitive analysis and opposing viewpoints', enabled: true },
  'seek_network': { name: 'Network Seeker', description: 'Social and professional network search', enabled: true },
  'seek_lore': { name: 'Lore Seeker', description: 'Historical and cultural context search', enabled: true },
  'memory_search': { name: 'Memory Search', description: 'Search past research sessions', enabled: true },
  'memory_insights': { name: 'Memory Insights', description: 'Get insights from research history', enabled: true }
};

/**
 * Exa AI Web Search MCP Server with Symphony Orchestration
 * 
 * This MCP server integrates Exa AI's search capabilities with Claude and other MCP-compatible clients.
 * Exa is a search engine and API specifically designed for up-to-date web searching and retrieval,
 * offering more recent and comprehensive results than what might be available in an LLM's training data.
 * 
 * The server provides two modes of operation:
 * 
 * **Standard Tools:**
 * - Real-time web searching with configurable parameters
 * - Research paper searches
 * - Company research and analysis
 * - Competitive intelligence
 * - And more!
 * 
 * **Symphony Orchestration (NEW):**
 * - Orchestrated multi-seeker research using the "Seven Seekers" pattern
 * - Truth, Scholar, Commerce, Source, Rival, Network, and Lore seekers
 * - Resonance detection between findings from different sources
 * - Intelligent synthesis of multi-perspective research
 * - Research memory and pattern recognition
 * - Individual seeker access for targeted searches
 * 
 * Enable Symphony features with enableSymphony: true in configuration.
 */

export default function ({ config }: { config: z.infer<typeof configSchema> }) {
  try {
    // Set the API key in environment for tool functions to use
    // process.env.EXA_API_KEY = config.exaApiKey;
    
    if (config.debug) {
      log("Starting Exa MCP Server in debug mode");
    }

    // Create MCP server
    const server = new McpServer({
      name: "exa-search-server",
      version: "1.0.0"
    });
    
    log("Server initialized with modern MCP SDK and Smithery CLI support");

    // Helper function to check if a tool should be registered
    const shouldRegisterTool = (toolId: string): boolean => {
      if (config.enabledTools && config.enabledTools.length > 0) {
        return config.enabledTools.includes(toolId);
      }
      return availableTools[toolId as keyof typeof availableTools]?.enabled ?? false;
    };

    // Register tools based on configuration
    const registeredTools: string[] = [];
    
    if (shouldRegisterTool('web_search_exa')) {
      registerWebSearchTool(server, config);
      registeredTools.push('web_search_exa');
    }
    
    if (shouldRegisterTool('research_paper_search_exa')) {
      registerResearchPaperSearchTool(server, config);
      registeredTools.push('research_paper_search_exa');
    }
    
    if (shouldRegisterTool('company_research_exa')) {
      registerCompanyResearchTool(server, config);
      registeredTools.push('company_research_exa');
    }
    
    if (shouldRegisterTool('crawling_exa')) {
      registerCrawlingTool(server, config);
      registeredTools.push('crawling_exa');
    }
    
    if (shouldRegisterTool('competitor_finder_exa')) {
      registerCompetitorFinderTool(server, config);
      registeredTools.push('competitor_finder_exa');
    }
    
    if (shouldRegisterTool('linkedin_search_exa')) {
      registerLinkedInSearchTool(server, config);
      registeredTools.push('linkedin_search_exa');
    }
    
    if (shouldRegisterTool('wikipedia_search_exa')) {
      registerWikipediaSearchTool(server, config);
      registeredTools.push('wikipedia_search_exa');
    }
    
    if (shouldRegisterTool('github_search_exa')) {
      registerGithubSearchTool(server, config);
      registeredTools.push('github_search_exa');
    }
    
    // Register Symphony tools if enabled
    if (config.enableSymphony) {
      // Main symphony orchestration tool
      server.tool(
        "symphony",
        "Orchestrate multiple seekers to research a topic",
        {
          query: z.string().describe("What to research"),
          seekers: z.array(z.string()).optional().describe("Which seekers to use (default: all)"),
          resonanceThreshold: z.number().optional().describe("Similarity threshold for resonance detection (0-1)")
        },
        async ({ query, seekers, resonanceThreshold }) => {
          try {
            // Dynamic import to avoid startup issues
            const { conductor } = await import("./symphony/conductor.js");
            const { researchMemory } = await import("./memory.js");
            
            // Set API key for seekers
            if (config.exaApiKey) {
              process.env.EXA_API_KEY = config.exaApiKey;
            }
            
            const symphony = await conductor.perform(query, {
              seekers,
              resonanceThreshold
            });
            
            // Remember this research
            researchMemory.remember(symphony);
            
            return {
              content: [{
                type: "text" as const,
                text: JSON.stringify(symphony, null, 2)
              }]
            };
          } catch (error) {
            return {
              content: [{
                type: "text" as const,
                text: `Symphony error: ${error instanceof Error ? error.message : String(error)}`
              }],
              isError: true
            };
          }
        }
      );

      // Individual seeker tools
      const seekerNames = ['truth', 'scholar', 'commerce', 'source', 'rival', 'network', 'lore'];
      
      seekerNames.forEach(name => {
        server.tool(
          `seek_${name}`,
          `Use the ${name} seeker directly`,
          {
            query: z.string().describe("What to search for")
          },
          async ({ query }) => {
            try {
              // Dynamic import to avoid startup issues
              const { conductor } = await import("./symphony/conductor.js");
              
              // Set API key for seekers
              if (config.exaApiKey) {
                process.env.EXA_API_KEY = config.exaApiKey;
              }
              
              const seeker = conductor.seekers[name];
              const findings = await seeker.seek(query);
              
              return {
                content: [{
                  type: "text" as const,
                  text: JSON.stringify(findings, null, 2)
                }]
              };
            } catch (error) {
              return {
                content: [{
                  type: "text" as const,
                  text: `Seeker error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
              };
            }
          }
        );
      });

      // Memory tools
      server.tool(
        "memory_search",
        "Search past research",
        {
          query: z.string().describe("What to search for in memory")
        },
        async ({ query }) => {
          const { researchMemory } = await import("./memory.js");
          const similar = researchMemory.findSimilar(query);
          return {
            content: [{
              type: "text" as const,
              text: JSON.stringify(similar, null, 2)
            }]
          };
        }
      );

      server.tool(
        "memory_insights",
        "Get insights from research history",
        {},
        async () => {
          const { researchMemory } = await import("./memory.js");
          const insights = researchMemory.getInsights();
          return {
            content: [{
              type: "text" as const,
              text: JSON.stringify(insights, null, 2)
            }]
          };
        }
      );

      registeredTools.push('symphony', ...seekerNames.map(name => `seek_${name}`), 'memory_search', 'memory_insights');
    }
    
    if (config.debug) {
      log(`Registered ${registeredTools.length} tools: ${registeredTools.join(', ')}`);
      if (config.enableSymphony) {
        log(`Symphony orchestration enabled with seekers: ${Object.keys(conductor.seekers).join(', ')}`);
      }
    }
    
    // Return the server object (Smithery CLI handles transport)
    return server.server;
    
  } catch (error) {
    log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
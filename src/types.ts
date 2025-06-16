// Exa API Types
export interface ExaSearchRequest {
  query: string;
  type: string;
  category?: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  numResults: number;
  contents: {
    text: {
      maxCharacters?: number;
    } | boolean;
    livecrawl?: 'always' | 'fallback' | 'preferred';
    subpages?: number;
    subpageTarget?: string[];
  };
}

export interface ExaCrawlRequest {
  ids: string[];
  text: boolean;
  livecrawl?: 'always' | 'fallback' | 'preferred';
}

export interface ExaSearchResult {
  id: string;
  title: string;
  url: string;
  publishedDate: string;
  author: string;
  text: string;
  image?: string;
  favicon?: string;
  score?: number;
}

export interface ExaSearchResponse {
  requestId: string;
  autopromptString: string;
  resolvedSearchType: string;
  results: ExaSearchResult[];
}

// Tool Types
export interface SearchArgs {
  query: string;
  numResults?: number;
  livecrawl?: 'always' | 'fallback' | 'preferred';
}

// Symphony Types - Integrated from Symphony-1

// A Finding is what any Seeker discovers
export interface Finding {
  source: string;      // Which Seeker found this
  content: string;     // The actual content
  url?: string;        // Optional source URL
  confidence: number;  // 0-1 confidence score
  timestamp: number;   // When found
}

// A Seeker searches for truth in its own way
export interface Seeker {
  name: string;
  seek: (query: string) => Promise<Finding[]>;
}

// Resonance occurs when multiple findings align
export interface Resonance {
  findings: Finding[];
  strength: number;    // How strongly they resonate (0-1)
  pattern: string;     // What pattern emerges
}

// A Symphony is the complete orchestrated search
export interface Symphony {
  query: string;
  findings: Finding[];
  resonances: Resonance[];
  synthesis: string;   // The final insight
  duration: number;    // How long it took
}

// Simplified Exa Types for Symphony
export interface ExaResult {
  title: string;
  url: string;
  text: string;
  score?: number;
}

export interface ExaResponse {
  results: ExaResult[];
}
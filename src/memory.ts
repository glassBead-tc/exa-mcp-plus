// Research Memory - Learn from each symphony performed
import { Symphony } from './types.js';

interface Memory {
  query: string;
  timestamp: number;
  topFindings: string[];
  resonanceStrength: number;
  duration: number;
}

// Simple in-memory storage (can be replaced with persistence)
const memories: Memory[] = [];

export const researchMemory = {
  // Remember a symphony
  remember(symphony: Symphony) {
    const memory: Memory = {
      query: symphony.query,
      timestamp: Date.now(),
      topFindings: symphony.findings
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map(f => f.content.substring(0, 100) + '...'),
      resonanceStrength: symphony.resonances[0]?.strength || 0,
      duration: symphony.duration
    };
    
    memories.push(memory);
    
    // Keep only last 100 memories
    if (memories.length > 100) {
      memories.shift();
    }
  },
  
  // Find similar past research
  findSimilar(query: string, limit: number = 5): Memory[] {
    const queryWords = new Set(query.toLowerCase().split(/\s+/));
    
    return memories
      .map(memory => {
        const memoryWords = new Set(memory.query.toLowerCase().split(/\s+/));
        const overlap = [...queryWords].filter(w => memoryWords.has(w)).length;
        const similarity = overlap / Math.max(queryWords.size, memoryWords.size);
        
        return { memory, similarity };
      })
      .filter(({ similarity }) => similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(({ memory }) => memory);
  },
  
  // Get performance insights
  getInsights() {
    if (memories.length === 0) {
      return { totalSearches: 0, avgDuration: 0, avgResonance: 0 };
    }
    
    const totalSearches = memories.length;
    const avgDuration = memories.reduce((sum, m) => sum + m.duration, 0) / totalSearches;
    const avgResonance = memories.reduce((sum, m) => sum + m.resonanceStrength, 0) / totalSearches;
    
    return {
      totalSearches,
      avgDuration: Math.round(avgDuration),
      avgResonance: Math.round(avgResonance * 100)
    };
  },
  
  // Export memories
  export(): Memory[] {
    return [...memories];
  },
  
  // Import memories
  import(data: Memory[]) {
    memories.push(...data);
  }
};
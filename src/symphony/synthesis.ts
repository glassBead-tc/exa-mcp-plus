// Dialectical Synthesis - Creates insights from findings and resonances
import { Finding, Resonance } from '../types.js';

// Extract key themes from content
function extractThemes(content: string): string[] {
  // Simple keyword extraction
  const words = content.toLowerCase().split(/\s+/);
  const wordCount = new Map<string, number>();
  
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
  
  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
  });
  
  return [...wordCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

// Synthesize findings into a coherent insight
export function synthesize(findings: Finding[], resonances: Resonance[]): string {
  if (findings.length === 0) {
    return 'No findings to synthesize.';
  }
  
  // Collect all content
  const allContent = findings.map(f => f.content).join('\n\n');
  const themes = extractThemes(allContent);
  
  // Build synthesis
  const parts: string[] = [];
  
  // Key themes
  parts.push(`Key themes: ${themes.join(', ')}`);
  
  // Strongest resonances
  if (resonances.length > 0) {
    const strongest = resonances[0];
    parts.push(`\nStrongest convergence (${Math.round(strongest.strength * 100)}%): ${strongest.pattern}`);
  }
  
  // Source diversity
  const sources = [...new Set(findings.map(f => f.source))];
  parts.push(`\nSources consulted: ${sources.join(', ')}`);
  
  // Confidence summary
  const avgConfidence = findings.reduce((sum, f) => sum + f.confidence, 0) / findings.length;
  parts.push(`\nAverage confidence: ${Math.round(avgConfidence * 100)}%`);
  
  // Contradictions (if any)
  const contradictions = findContradictions(findings);
  if (contradictions.length > 0) {
    parts.push(`\nContradictions found: ${contradictions.length}`);
    parts.push('These contradictions may represent different perspectives or evolving understanding.');
  }
  
  return parts.join('\n');
}

// Find potential contradictions in findings
function findContradictions(findings: Finding[]): Array<[Finding, Finding]> {
  const contradictions: Array<[Finding, Finding]> = [];
  
  // Simple contradiction detection based on opposing keywords
  const opposites = [
    ['increase', 'decrease'],
    ['positive', 'negative'],
    ['success', 'failure'],
    ['growth', 'decline']
  ];
  
  for (let i = 0; i < findings.length; i++) {
    for (let j = i + 1; j < findings.length; j++) {
      for (const [word1, word2] of opposites) {
        if (
          (findings[i].content.includes(word1) && findings[j].content.includes(word2)) ||
          (findings[i].content.includes(word2) && findings[j].content.includes(word1))
        ) {
          contradictions.push([findings[i], findings[j]]);
        }
      }
    }
  }
  
  return contradictions;
}
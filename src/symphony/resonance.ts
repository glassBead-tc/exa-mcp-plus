// Resonance Detection - Finds when different findings converge on similar truths
import { Finding, Resonance } from '../types.js';

// Calculate similarity between two texts (simple version)
function similarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// Detect resonances in a set of findings
export function detectResonances(findings: Finding[], threshold: number = 0.3): Resonance[] {
  const resonances: Resonance[] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < findings.length; i++) {
    if (used.has(i)) continue;
    
    const group: Finding[] = [findings[i]];
    used.add(i);
    
    for (let j = i + 1; j < findings.length; j++) {
      if (used.has(j)) continue;
      
      const sim = similarity(findings[i].content, findings[j].content);
      if (sim >= threshold) {
        group.push(findings[j]);
        used.add(j);
      }
    }
    
    if (group.length > 1) {
      const strength = group.reduce((sum, f) => sum + f.confidence, 0) / group.length;
      const sources = [...new Set(group.map(f => f.source))].join(' + ');
      
      resonances.push({
        findings: group,
        strength,
        pattern: `Convergence from ${sources}`
      });
    }
  }
  
  return resonances.sort((a, b) => b.strength - a.strength);
}
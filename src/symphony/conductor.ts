// Symphony Conductor - Orchestrates the Seven Seekers
import { Seeker, Finding, Symphony } from '../types.js';
import { truthSeeker } from '../seekers/truth.js';
import { scholarSeeker } from '../seekers/scholar.js';
import { commerceSeeker } from '../seekers/commerce.js';
import { sourceSeeker } from '../seekers/source.js';
import { rivalSeeker } from '../seekers/rival.js';
import { networkSeeker } from '../seekers/network.js';
import { loreSeeker } from '../seekers/lore.js';
import { detectResonances } from './resonance.js';
import { synthesize } from './synthesis.js';

// Available seekers
const seekerRegistry: Record<string, Seeker> = {
  truth: truthSeeker,
  scholar: scholarSeeker,
  commerce: commerceSeeker,
  source: sourceSeeker,
  rival: rivalSeeker,
  network: networkSeeker,
  lore: loreSeeker
};

// Conductor options
interface ConductorOptions {
  seekers?: string[];           // Which seekers to use
  resonanceThreshold?: number;  // Minimum similarity for resonance
  parallel?: boolean;           // Run seekers in parallel
}

// The Conductor orchestrates seekers to create a symphony
export const conductor = {
  // Get available seekers
  seekers: seekerRegistry,
  
  // Add a custom seeker
  addSeeker(seeker: Seeker) {
    seekerRegistry[seeker.name] = seeker;
  },
  
  // Perform a symphony
  async perform(query: string, options: ConductorOptions = {}): Promise<Symphony> {
    const startTime = Date.now();
    
    // Select seekers to use
    const selectedSeekers = options.seekers 
      ? options.seekers.map(name => seekerRegistry[name]).filter(Boolean)
      : Object.values(seekerRegistry);
    
    if (selectedSeekers.length === 0) {
      throw new Error('No seekers available');
    }
    
    // Gather findings
    let findings: Finding[];
    
    if (options.parallel !== false) {
      // Parallel execution (default)
      const promises = selectedSeekers.map(seeker => seeker.seek(query));
      const results = await Promise.all(promises);
      findings = results.flat();
    } else {
      // Sequential execution
      findings = [];
      for (const seeker of selectedSeekers) {
        const result = await seeker.seek(query);
        findings.push(...result);
      }
    }
    
    // Detect resonances
    const resonances = detectResonances(findings, options.resonanceThreshold);
    
    // Create synthesis
    const synthesis = synthesize(findings, resonances);
    
    // Return complete symphony
    return {
      query,
      findings,
      resonances,
      synthesis,
      duration: Date.now() - startTime
    };
  }
};
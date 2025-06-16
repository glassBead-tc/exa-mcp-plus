// Scholar Seeker - Searches for academic papers and research
import axios from 'axios';
import { Seeker, Finding, ExaSearchRequest, ExaSearchResponse } from '../types.js';
import { API_CONFIG } from '../tools/config.js';

export const scholarSeeker: Seeker = {
  name: 'scholar',
  
  async seek(query: string): Promise<Finding[]> {
    try {
      const axiosInstance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'x-api-key': process.env.EXA_API_KEY || ''
        },
        timeout: 25000
      });

      const searchRequest: ExaSearchRequest = {
        query: `${query} site:arxiv.org OR site:scholar.google.com OR site:pubmed.ncbi.nlm.nih.gov OR site:researchgate.net`,
        type: 'auto',
        category: 'research paper',
        numResults: 5,
        contents: {
          text: {
            maxCharacters: 3000
          },
          livecrawl: 'preferred'
        }
      };

      const response = await axiosInstance.post<ExaSearchResponse>(
        API_CONFIG.ENDPOINTS.SEARCH,
        searchRequest
      );

      if (!response.data?.results) {
        return [];
      }

      return response.data.results.map(result => ({
        source: 'scholar',
        content: `${result.title}\n\n${result.text}`,
        url: result.url,
        confidence: result.score || 0.85,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Scholar Seeker error:', error);
      return [];
    }
  }
};
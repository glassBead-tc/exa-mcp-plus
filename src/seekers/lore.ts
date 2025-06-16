// Lore Seeker - Searches Wikipedia for established knowledge
import axios from 'axios';
import { Seeker, Finding, ExaSearchRequest, ExaSearchResponse } from '../types.js';
import { API_CONFIG } from '../tools/config.js';

export const loreSeeker: Seeker = {
  name: 'lore',
  
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
        query: `${query} site:wikipedia.org`,
        type: 'auto',
        numResults: 5,
        includeDomains: ['wikipedia.org', 'en.wikipedia.org'],
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
        source: 'lore',
        content: `${result.title}\n\n${result.text}`,
        url: result.url,
        confidence: 0.9, // Wikipedia = high confidence for established facts
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Lore Seeker error:', error);
      return [];
    }
  }
};
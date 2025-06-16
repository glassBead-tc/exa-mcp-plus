// Rival Seeker - Finds competitors and competitive intelligence
import axios from 'axios';
import { Seeker, Finding, ExaSearchRequest, ExaSearchResponse } from '../types.js';
import { API_CONFIG } from '../tools/config.js';

export const rivalSeeker: Seeker = {
  name: 'rival',
  
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
        query: `${query} competitors "similar to" "alternative to" "vs" market share`,
        type: 'auto',
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
        source: 'rival',
        content: `${result.title}\n\n${result.text}`,
        url: result.url,
        confidence: result.score || 0.7,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Rival Seeker error:', error);
      return [];
    }
  }
};
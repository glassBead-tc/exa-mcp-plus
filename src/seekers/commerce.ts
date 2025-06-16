// Commerce Seeker - Researches companies and business information
import axios from 'axios';
import { Seeker, Finding, ExaSearchRequest, ExaSearchResponse } from '../types.js';
import { API_CONFIG } from '../tools/config.js';

export const commerceSeeker: Seeker = {
  name: 'commerce',
  
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
        query: `${query} company business revenue funding`,
        type: 'auto',
        category: 'company',
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
        source: 'commerce',
        content: `${result.title}\n\n${result.text}`,
        url: result.url,
        confidence: result.score || 0.75,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Commerce Seeker error:', error);
      return [];
    }
  }
};
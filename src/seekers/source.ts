// Source Seeker - Extracts content directly from URLs
import axios from 'axios';
import { Seeker, Finding, ExaSearchRequest, ExaSearchResponse } from '../types.js';
import { API_CONFIG } from '../tools/config.js';

export const sourceSeeker: Seeker = {
  name: 'source',
  
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

      // If query is a URL, crawl it directly
      if (query.startsWith('http://') || query.startsWith('https://')) {
        const response = await axiosInstance.post(
          '/contents',
          {
            ids: [query],
            text: true,
            livecrawl: 'always'
          }
        );

        const result = response.data.results?.[0];
        if (result) {
          return [{
            source: 'source',
            content: `${result.title || 'Content'}\n\n${result.text || ''}`,
            url: query,
            confidence: 0.95, // Direct source = high confidence
            timestamp: Date.now()
          }];
        }
      }
      
      // Otherwise, search for URLs related to the query
      const searchRequest: ExaSearchRequest = {
        query,
        type: 'auto',
        numResults: 3,
        contents: {
          text: {
            maxCharacters: 5000
          },
          livecrawl: 'always'
        }
      };

      const searchResponse = await axiosInstance.post<ExaSearchResponse>(
        API_CONFIG.ENDPOINTS.SEARCH,
        searchRequest
      );

      if (!searchResponse.data?.results) {
        return [];
      }

      return searchResponse.data.results.map(result => ({
        source: 'source',
        content: `${result.title}\n\n${result.text}`,
        url: result.url,
        confidence: 0.9,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Source Seeker error:', error);
      return [];
    }
  }
};
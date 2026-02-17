
import { GoogleGenAI } from "@google/genai";

export class JunkCarService {
  // Use GoogleGenAI according to the latest SDK guidelines
  async estimateValue(details: { make: string; model: string; year: string; condition: string }) {
    try {
      // Initialize inside the method to ensure the most up-to-date API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Act as an expert auto salvage appraiser in Milwaukee, WI. 
      Based on the following details, provide a realistic estimated cash value range (e.g., $300 - $1500) and a brief 2-sentence explanation of why it's valued that way based on current scrap prices or parts demand.
      
      Details: ${details.year} ${details.make} ${details.model} in ${details.condition} condition.
      
      Respond in JSON format with two keys: "range" (string) and "explanation" (string).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      // response.text is a property, not a method
      return JSON.parse(response.text || '{"range": "Contact us", "explanation": "Unable to estimate automatically."}');
    } catch (error) {
      console.error("Valuation error:", error);
      return { range: "Get Quote", explanation: "Call us for our best offer today!" };
    }
  }
}

export const junkCarService = new JunkCarService();

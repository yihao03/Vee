import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../config/gemini';
import { BOOKING_INTENT_SCHEMA, BookingIntentAnalysis } from '../types/gemini';

/**
 * Service for analyzing user messages to determine booking intent using AI
 */
class BookingIntentAnalyzer {
  private genAI: GoogleGenerativeAI;
  private analysisModel: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.API_KEY);
    this.initializeModel();
  }

  /**
   * Initialize the Gemini model with structured output configuration
   */
  private initializeModel(): void {
    this.analysisModel = this.genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.MODEL,
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.1, // Low temperature for consistent output
        responseMimeType: "application/json",
        responseSchema: BOOKING_INTENT_SCHEMA as any
      }
    });
  }

  /**
   * Analyze user message to determine booking intent using AI
   */
  async analyzeIntent(userMessage: string): Promise<BookingIntentAnalysis> {
    try {
      const analysisPrompt = `Analyze this user message for booking intent:

User message: "${userMessage}"

Determine if the user is looking for:
- Hotels/accommodation (type: "hotels")
- Restaurants/food (type: "restaurants") 
- Both (type: "both")
- Neither (type: "none")

Extract any specific search terms like location, cuisine type, hotel type, etc.

Be generous with interpretation - err on the side of providing suggestions.
Consider context: "I'm hungry" = restaurants, "Need a place to stay" = hotels, "Planning a trip" = both`;

      const result = await this.analysisModel.generateContent(analysisPrompt);
      const response = await result.response;
      const analysisText = response.text().trim();

      // Parse the structured JSON response
      try {
        const analysis = JSON.parse(analysisText);
        return {
          needsSuggestions: analysis.needsSuggestions || false,
          type: analysis.type || 'none',
          searchQuery: analysis.searchQuery || undefined
        };
      } catch (parseError) {
        console.warn('Failed to parse booking analysis JSON:', analysisText);
        // Return no suggestions if parsing fails
        return {
          needsSuggestions: false,
          type: 'none' as const,
          searchQuery: undefined
        };
      }
    } catch (error) {
      console.error('Error analyzing booking intent:', error);
      // Return no suggestions if AI analysis fails
      return {
        needsSuggestions: false,
        type: 'none' as const,
        searchQuery: undefined
      };
    }
  }

  /**
   * Check if the analyzer is properly configured
   */
  isConfigured(): boolean {
    return this.analysisModel !== null && this.analysisModel !== undefined;
  }
}

// Export singleton instance
export const bookingIntentAnalyzer = new BookingIntentAnalyzer();
export default bookingIntentAnalyzer;

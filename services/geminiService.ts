import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, validateGeminiConfig } from '../config/gemini';
import { BookingItem } from '../types/booking';
import { AIRecommendation, AI_RECOMMENDATION_SCHEMA, GeminiResponse } from '../types/gemini';
import bookingIntentAnalyzer from './bookingIntentAnalyzer';
import bookingService from './bookingService';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.API_KEY);

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}


class GeminiService {
  private model: any;
  private chatHistory: ChatMessage[] = [];

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.MODEL,
      systemInstruction: `You are Vee, a helpful AI travel assistant. You help users with travel planning, hotel bookings, restaurant recommendations, and general travel advice. 

Key guidelines:
- Be friendly, helpful, and conversational
- Provide specific and actionable travel advice
- When recommending places, mention why they're good choices
- Ask follow-up questions to better understand user needs
- Keep responses concise but informative
- If you don't know something, admit it and offer to help find the information`,
      generationConfig: {
        maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS,
        temperature: GEMINI_CONFIG.TEMPERATURE,
      }
    });
  }

  /**
   * Send a message to Gemini and get a response
   */
  async sendMessage(userMessage: string): Promise<GeminiResponse> {
    try {
      if (!validateGeminiConfig()) {
        throw new Error('Gemini API key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment variables.');
      }

      // Add user message to history
      const userChatMessage: ChatMessage = {
        text: userMessage,
        isUser: true,
        timestamp: new Date()
      };
      this.chatHistory.push(userChatMessage);

      // STEP 1: Analyze booking intent first
      const bookingAnalysis = await bookingIntentAnalyzer.analyzeIntent(userMessage);
      let suggestions: BookingItem[] = [];
      let aiMessage: string;
      let aiRecommendation: AIRecommendation | undefined;

      if (bookingAnalysis.needsSuggestions) {
        // STEP 2: Get relevant options based on intent
        if (bookingAnalysis.type === 'hotels' || bookingAnalysis.type === 'both') {
          if (bookingAnalysis.searchQuery) {
            suggestions = [...suggestions, ...bookingService.searchHotels(bookingAnalysis.searchQuery, 5)];
          } else {
            suggestions = [...suggestions, ...bookingService.getRandomHotels(5)];
          }
        }

        if (bookingAnalysis.type === 'restaurants' || bookingAnalysis.type === 'both') {
          if (bookingAnalysis.searchQuery) {
            suggestions = [...suggestions, ...bookingService.searchRestaurants(bookingAnalysis.searchQuery, 5)];
          } else {
            suggestions = [...suggestions, ...bookingService.getRandomRestaurants(5)];
          }
        }

        // STEP 3: Create AI prompt with available options for selection
        const optionsText = this.formatOptionsForAI(suggestions, bookingAnalysis.type);
        const selectionPrompt = this.createSelectionPrompt(userMessage, bookingAnalysis, optionsText);

        // STEP 4: Get AI response with structured selection from available options
        const selectionModel = genAI.getGenerativeModel({
          model: GEMINI_CONFIG.MODEL,
          generationConfig: {
            maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS,
            temperature: GEMINI_CONFIG.TEMPERATURE,
            responseMimeType: "application/json",
            responseSchema: AI_RECOMMENDATION_SCHEMA as any
          }
        });

        const result = await selectionModel.generateContent(selectionPrompt);
        const response = await result.response;
        const structuredResponse = response.text();

        // Parse structured response
        try {
          const parsed = JSON.parse(structuredResponse);
          aiRecommendation = parsed;
          aiMessage = parsed.response;
          
          // STEP 5: Filter suggestions based on structured selection
          suggestions = this.filterSelectedOptionsStructured(suggestions, parsed.selectedOptions);
        } catch (parseError) {
          console.warn('Failed to parse AI recommendation JSON:', structuredResponse);
          // Fallback to regular response
          const chat = this.model.startChat({
            history: this.buildChatHistory(),
            generationConfig: {
              maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS,
              temperature: GEMINI_CONFIG.TEMPERATURE,
            }
          });
          const fallbackResult = await chat.sendMessage(selectionPrompt);
          const fallbackResponse = await fallbackResult.response;
          aiMessage = fallbackResponse.text();
          suggestions = this.filterSelectedOptions(suggestions, aiMessage);
        }
      } else {
        // STEP 6: Regular chat without booking suggestions
        const chat = this.model.startChat({
          history: this.buildChatHistory(),
          generationConfig: {
            maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS,
            temperature: GEMINI_CONFIG.TEMPERATURE,
          }
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        aiMessage = response.text();
      }

      // Add AI response to history
      const aiChatMessage: ChatMessage = {
        text: aiMessage,
        isUser: false,
        timestamp: new Date()
      };
      this.chatHistory.push(aiChatMessage);

      return {
        success: true,
        message: aiMessage,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        aiRecommendation: aiRecommendation
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback response in case of error
      const fallbackMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      
      const fallbackChatMessage: ChatMessage = {
        text: fallbackMessage,
        isUser: false,
        timestamp: new Date()
      };
      this.chatHistory.push(fallbackChatMessage);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: fallbackMessage
      };
    }
  }

  /**
   * Build chat history for Gemini in the correct format
   */
  private buildChatHistory(): Array<{ role: string; parts: Array<{ text: string }> }> {
    const history: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Convert our chat history to Gemini's expected format
    // Skip the last message (current user message) as it will be sent separately
    const historyMessages = this.chatHistory.slice(0, -1);
    
    for (const message of historyMessages) {
      history.push({
        role: message.isUser ? 'user' : 'model',
        parts: [{ text: message.text }]
      });
    }

    return history;
  }

  /**
   * Clear chat history
   */
  clearHistory(): void {
    this.chatHistory = [];
  }

  /**
   * Get current chat history
   */
  getHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  /**
   * Set chat history (useful for restoring state)
   */
  setHistory(history: ChatMessage[]): void {
    this.chatHistory = [...history];
  }

  /**
   * Format available options for AI selection
   */
  private formatOptionsForAI(options: BookingItem[], type: string): string {
    if (options.length === 0) return '';

    const typeLabel = type === 'hotels' ? 'Hotels' : type === 'restaurants' ? 'Restaurants' : 'Options';
    
    let formatted = `\n\nAvailable ${typeLabel}:\n`;
    options.forEach((option, index) => {
      formatted += `${index + 1}. ${option.name}\n`;
      if (option.short_description) {
        formatted += `   Description: ${option.short_description}\n`;
      }
      if (option.price) {
        formatted += `   Price: ${option.price}\n`;
      }
      formatted += '\n';
    });

    return formatted;
  }

  /**
   * Create AI prompt for selecting best options with structured output
   */
  private createSelectionPrompt(userMessage: string, analysis: any, optionsText: string): string {
    const typeLabel = analysis.type === 'hotels' ? 'hotels' : 
                     analysis.type === 'restaurants' ? 'restaurants' : 
                     'places';

    return `The user is looking for ${typeLabel}. Based on their request: "${userMessage}"

${optionsText}

Please analyze their specific needs and preferences, then select the 2-3 BEST options from the available list above.

Respond with a JSON object containing:
- selectedOptions: Array of the exact option names you selected (2-3 options)
- explanation: Brief explanation of why you chose these specific options
- response: A conversational response to the user explaining your recommendations

Focus on matching their specific requirements and preferences. Be conversational and helpful in your response.`;
  }

  /**
   * Filter suggestions based on structured AI selection
   */
  private filterSelectedOptionsStructured(allOptions: BookingItem[], selectedOptionNames: string[]): BookingItem[] {
    const selectedOptions: BookingItem[] = [];
    
    selectedOptionNames.forEach(optionName => {
      const matchingOption = allOptions.find(option => 
        option.name.toLowerCase() === optionName.toLowerCase()
      );
      if (matchingOption) {
        selectedOptions.push(matchingOption);
      }
    });

    // If no exact matches found, return top 2-3 options
    if (selectedOptions.length === 0) {
      return allOptions.slice(0, 3);
    }

    return selectedOptions;
  }

  /**
   * Filter suggestions based on AI selection in the response (fallback method)
   */
  private filterSelectedOptions(allOptions: BookingItem[], aiResponse: string): BookingItem[] {
    // Simple keyword matching to find selected options
    // This could be enhanced with more sophisticated NLP
    const selectedOptions: BookingItem[] = [];
    
    allOptions.forEach(option => {
      // Check if the option name appears in the AI response
      if (aiResponse.toLowerCase().includes(option.name.toLowerCase())) {
        selectedOptions.push(option);
      }
    });

    // If no specific matches found, return top 2-3 options
    if (selectedOptions.length === 0) {
      return allOptions.slice(0, 3);
    }

    return selectedOptions.slice(0, 3);
  }

}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;

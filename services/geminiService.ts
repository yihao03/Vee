import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, validateGeminiConfig } from '../config/gemini';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.API_KEY);

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

export interface GeminiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class GeminiService {
  private model: any;
  private chatHistory: ChatMessage[] = [];

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.MODEL,
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

      // Prepare the conversation context for Gemini
      const conversationContext = this.buildConversationContext();

      // Generate response using Gemini
      const result = await this.model.generateContent(conversationContext);
      const response = await result.response;
      const aiMessage = response.text();

      // Add AI response to history
      const aiChatMessage: ChatMessage = {
        text: aiMessage,
        isUser: false,
        timestamp: new Date()
      };
      this.chatHistory.push(aiChatMessage);

      return {
        success: true,
        message: aiMessage
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
   * Build conversation context for Gemini
   */
  private buildConversationContext(): string {
    const systemPrompt = `You are Vee, a helpful AI travel assistant. You help users with travel planning, hotel bookings, restaurant recommendations, and general travel advice. 

Key guidelines:
- Be friendly, helpful, and conversational
- Provide specific and actionable travel advice
- When recommending places, mention why they're good choices
- Ask follow-up questions to better understand user needs
- Keep responses concise but informative
- If you don't know something, admit it and offer to help find the information

Current conversation:`;

    const conversationHistory = this.chatHistory
      .map(msg => `${msg.isUser ? 'User' : 'Vee'}: ${msg.text}`)
      .join('\n');

    return `${systemPrompt}\n\n${conversationHistory}`;
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
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;

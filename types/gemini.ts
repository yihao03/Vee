/**
 * Gemini API response schemas and types
 */

export interface BookingIntentAnalysis {
  needsSuggestions: boolean;
  type: 'hotels' | 'restaurants' | 'both' | 'none';
  searchQuery?: string;
}

export const BOOKING_INTENT_SCHEMA = {
  type: "object" as const,
  properties: {
    needsSuggestions: {
      type: "boolean" as const,
      description: "Whether the user needs booking suggestions"
    },
    type: {
      type: "string" as const,
      enum: ["hotels", "restaurants", "both", "none"] as const,
      description: "Type of booking needed: hotels, restaurants, both, or none"
    },
    searchQuery: {
      type: "string" as const,
      description: "Extracted search terms or null if no specific terms"
    }
  },
  required: ["needsSuggestions", "type"] as const,
  propertyOrdering: ["needsSuggestions", "type", "searchQuery"] as const
};

export interface GeminiResponse {
  success: boolean;
  message?: string;
  error?: string;
  suggestions?: any[]; // Will be typed as BookingItem[] in the service
  aiRecommendation?: AIRecommendation;
}

export interface AIRecommendation {
  selectedOptions: string[]; // Array of option names that were selected
  explanation: string; // Why these options were chosen
  response: string; // The conversational response to the user
}

export const AI_RECOMMENDATION_SCHEMA = {
  type: "object" as const,
  properties: {
    selectedOptions: {
      type: "array" as const,
      items: {
        type: "string" as const
      },
      description: "Array of option names that were selected (2-3 options)"
    },
    explanation: {
      type: "string" as const,
      description: "Brief explanation of why these specific options were chosen"
    },
    response: {
      type: "string" as const,
      description: "The conversational response to the user explaining the recommendations"
    }
  },
  required: ["selectedOptions", "explanation", "response"] as const,
  propertyOrdering: ["selectedOptions", "explanation", "response"] as const
};

// Gemini API Configuration
export const GEMINI_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
  MODEL: 'gemini-2.5-flash',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
};

// Validation function
export const validateGeminiConfig = (): boolean => {
  return !!GEMINI_CONFIG.API_KEY && GEMINI_CONFIG.API_KEY !== 'your_gemini_api_key_here';
};

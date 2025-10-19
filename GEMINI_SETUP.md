# Gemini API Integration Setup

This project now includes integration with Google's Gemini API for AI-powered chat functionality.

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

Create a `.env` file in the project root and add your API key:

```bash
# Gemini API Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your actual Gemini API key.

### 3. Install Dependencies

The required dependencies are already installed, but if you need to reinstall:

```bash
npm install @google/generative-ai
```

### 4. Start the App

```bash
npm start
```

## Features

- **Real AI Responses**: Chat with Vee using Google's Gemini AI model
- **Loading States**: Visual indicators when the AI is processing your message
- **Error Handling**: Graceful fallback messages if the API is unavailable
- **Conversation Context**: The AI maintains conversation history for better responses
- **Travel-Focused**: Vee is specifically trained to help with travel planning and recommendations

## Configuration

The Gemini service is configured in `config/gemini.ts` with the following settings:

- **Model**: `gemini-1.5-flash` (fast and efficient)
- **Max Tokens**: 1000 (adjustable)
- **Temperature**: 0.7 (balanced creativity and consistency)

## Usage

1. Open the app and tap on the search bar
2. Type your travel-related question or request
3. Tap the send button
4. Wait for Vee's AI response
5. Continue the conversation naturally

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in the `.env` file
- Make sure the key starts with `EXPO_PUBLIC_` for Expo to recognize it
- Restart the development server after adding the environment variable

### Network Issues
- Check your internet connection
- Verify the API key has proper permissions
- Check the console for any error messages

### Fallback Behavior
If the Gemini API is unavailable, the app will show a fallback message and continue to work with basic functionality.

## File Structure

```
services/
  └── geminiService.ts     # Main Gemini API service
config/
  └── gemini.ts           # Configuration settings
app/(tabs)/index/
  └── index.tsx           # Main chat screen logic
components/
  └── ExpandableHeader.tsx # Chat UI component
```

## Security Notes

- Never commit your actual API key to version control
- The `.env` file is already in `.gitignore`
- Use environment variables for all sensitive configuration

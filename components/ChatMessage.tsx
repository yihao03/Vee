import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR_MESSAGE_AI, COLOR_MESSAGE_USER, COLOR_TEXT_ACCENT, COLOR_TEXT_LIGHT } from '../constants/colors';
import { BookingItem } from '../types/booking';
import { AIRecommendation } from '../types/gemini';
import BookingSection from './BookingSection';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  aiRecommendation?: AIRecommendation;
  suggestions?: BookingItem[];
  onItemPress?: (item: BookingItem) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser, 
  aiRecommendation, 
  suggestions = [], 
  onItemPress 
}) => {
  const renderAIExplanation = () => {
    if (!aiRecommendation || isUser) return null;

    return (
      <View style={styles.explanationContainer}>
        <Text style={styles.explanationLabel}>Why I chose these:</Text>
        <Text style={styles.explanationText}>{aiRecommendation.explanation}</Text>
      </View>
    );
  };

  const renderRecommendationCards = () => {
    if (!suggestions || suggestions.length === 0 || isUser) return null;

    return (
      <View style={styles.cardsContainer}>
        <BookingSection
          title=""
          data={suggestions}
          onItemPress={onItemPress || (() => {})}
          showTitle={false}
          compact={true}
          horizontal={true}
        />
      </View>
    );
  };

  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
          {message}
        </Text>
        {renderAIExplanation()}
      </View>
      {renderRecommendationCards()}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: COLOR_MESSAGE_USER,
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: COLOR_MESSAGE_AI,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: COLOR_TEXT_LIGHT,
  },
  aiMessageText: {
    color: COLOR_TEXT_LIGHT,
  },
  explanationContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR_TEXT_ACCENT,
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 14,
    color: COLOR_TEXT_LIGHT,
    opacity: 0.9,
    lineHeight: 18,
  },
  cardsContainer: {
    marginTop: 12,
    marginHorizontal: -4, // Offset the padding from BookingSection
  },
});

export default ChatMessage;

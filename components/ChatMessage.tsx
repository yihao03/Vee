import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR_MESSAGE_AI, COLOR_MESSAGE_USER, COLOR_TEXT_LIGHT } from '../constants/colors';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => (
  <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
        {message}
      </Text>
    </View>
  </View>
);

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
});

export default ChatMessage;

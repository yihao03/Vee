import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLOR_CHAT_BG, COLOR_PRIMARY_DARK, COLOR_TEXT_ACCENT, COLOR_TEXT_LIGHT } from '../constants/colors';
import ChatMessage from './ChatMessage';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSendMessage: () => void;
  onBackToHome: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, searchQuery, setSearchQuery, onSendMessage, onBackToHome }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBackToHome} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLOR_TEXT_LIGHT} />
        </TouchableOpacity>
        <Text style={styles.chatTitle}>Chat with Vee</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
      </ScrollView>
      
      <View style={styles.chatInputContainer}>
        <View style={styles.chatInputWrapper}>
          <TextInput
            placeholder="Type your message..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.chatInput}
            multiline
            maxLength={500}
            theme={{
              colors: {
                primary: COLOR_TEXT_ACCENT,
                onSurface: COLOR_TEXT_LIGHT,
                surface: COLOR_CHAT_BG,
              },
            }}
          />
          <TouchableOpacity onPress={onSendMessage} style={styles.sendButton}>
            <MaterialCommunityIcons name="send" size={24} color={COLOR_TEXT_LIGHT} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: COLOR_CHAT_BG,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    backgroundColor: COLOR_PRIMARY_DARK,
  },
  backButton: {
    padding: 5,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR_TEXT_LIGHT,
  },
  placeholder: {
    width: 34, // Same width as back button for centering
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  chatInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 30,
    backgroundColor: COLOR_CHAT_BG,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLOR_PRIMARY_DARK,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  chatInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    color: COLOR_TEXT_LIGHT,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default ChatInterface;

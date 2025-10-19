import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

// Import components
import { BookingSection, ExpandableHeader } from '../../../components';

// Import constants
import { AI_RESPONSES, hotelData, restaurantData } from '../../../constants';
import { useChatContext } from '../../../contexts/ChatContext';
import { SCREEN_HEIGHT, searchScreenStyles } from '../../../styles/searchScreenStyles';

interface Message {
  text: string;
  isUser: boolean;
}

interface BookingItem {
  id: string;
  name: string;
  imageUrl: string;
}

// Main SearchScreen Component
export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { isChatMode, setIsChatMode } = useChatContext();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Vee, your AI travel assistant. How can I help you today?", isUser: false }
  ]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleSearchPress = (): void => {
    setIsChatMode(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBackToHome = (): void => {
    setIsChatMode(false);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchFocus = (): void => {
    setIsChatMode(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSendMessage = (): void => {
    if (searchQuery.trim()) {
      const newMessage: Message = { text: searchQuery, isUser: true };
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate AI response with more realistic responses
      setTimeout(() => {
        const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
        const aiResponse: Message = { text: randomResponse, isUser: false };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
      
      setSearchQuery('');
    }
  };

  const handleItemPress = (item: BookingItem): void => {
    console.log('Selected item:', item);
    // Implement item selection logic here
  };

  const chatTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const headerTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200],
  });

  return (
    <KeyboardAvoidingView 
      style={searchScreenStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ExpandableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSendMessage={handleSendMessage}
        onBackToHome={handleBackToHome}
        onSearchFocus={handleSearchFocus}
        isExpanded={isChatMode}
        messages={messages}
      />
      
      {!isChatMode && (
        <ScrollView
          style={searchScreenStyles.scrollView}
          contentContainerStyle={searchScreenStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BookingSection
            title="Book a hotel"
            data={hotelData}
            onItemPress={handleItemPress}
          />
          
          <BookingSection
            title="Book a restaurant"
            data={restaurantData}
            onItemPress={handleItemPress}
          />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

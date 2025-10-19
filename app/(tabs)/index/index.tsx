import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

// Import components
import { BookingSection, ExpandableHeader } from '../../../components';

// Import constants
import { useChatContext } from '../../../contexts/ChatContext';
import partnersData from '../../../partners/all.json';
import { geminiService } from '../../../services/geminiService';
import { searchScreenStyles } from '../../../styles/searchScreenStyles';
import { BookingItem } from '../../../types/booking';
import { AIRecommendation } from '../../../types/gemini';

// Type the JSON data
interface PartnersData {
  hotels: {
    name: string;
    short_description: string;
    long_description: string;
    price: string;
    image_url: string;
  }[];
  restaurants: {
    name: string;
    short_description: string;
    long_description: string;
    price: string;
    image_url: string;
  }[];
}

interface Message {
  text: string;
  isUser: boolean;
  suggestions?: BookingItem[];
  aiRecommendation?: AIRecommendation;
}


// Transform data from JSON to match BookingItem interface
const transformHotelData = (hotels: any[]): BookingItem[] => {
  return hotels.map((hotel, index) => ({
    id: `H${index + 1}`,
    name: hotel.name,
    imageUrl: hotel.image_url,
    short_description: hotel.short_description,
    price: hotel.price
  }));
};

const transformRestaurantData = (restaurants: any[]): BookingItem[] => {
  return restaurants.map((restaurant, index) => ({
    id: `R${index + 1}`,
    name: restaurant.name,
    imageUrl: restaurant.image_url,
    short_description: restaurant.short_description,
    price: restaurant.price
  }));
};

// Main SearchScreen Component
export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { isChatMode, setIsChatMode } = useChatContext();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Vee, your AI travel assistant. How can I help you today?", isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Transform data from JSON
  const hotelData = transformHotelData((partnersData as PartnersData).hotels);
  const restaurantData = transformRestaurantData((partnersData as PartnersData).restaurants);
  
  // Debug logging
  console.log('Hotel data:', hotelData.slice(0, 2));
  console.log('Restaurant data:', restaurantData.slice(0, 2));

  // Keyboard handling is now managed in ExpandableHeader component

  // handleSearchPress is now handled in ExpandableHeader component

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

  const handleSendMessage = async (): Promise<void> => {
    if (searchQuery.trim() && !isLoading) {
      const userMessage = searchQuery.trim();
      const newMessage: Message = { text: userMessage, isUser: true };
      setMessages(prev => [...prev, newMessage]);
      setSearchQuery('');
      setIsLoading(true);
      
      try {
        // Send message to Gemini API
        const response = await geminiService.sendMessage(userMessage);
        
        if (response.success && response.message) {
          const aiResponse: Message = { 
            text: response.message, 
            isUser: false,
            suggestions: response.suggestions,
            aiRecommendation: response.aiRecommendation
          };
          setMessages(prev => [...prev, aiResponse]);
        } else {
          // Handle error case
          const errorMessage: Message = { 
            text: response.message || "I'm sorry, I encountered an error. Please try again.", 
            isUser: false 
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error('Error sending message to Gemini:', error);
        const errorMessage: Message = { 
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 
          isUser: false 
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleItemPress = (item: BookingItem): void => {
    console.log('Selected item:', item);
    // Implement item selection logic here
  };

  // Animation values are now handled in ExpandableHeader component

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
        isLoading={isLoading}
        onItemPress={handleItemPress}
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

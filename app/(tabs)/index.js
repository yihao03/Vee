import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card, TextInput } from 'react-native-paper';

// Color Palette
const COLOR_PRIMARY_DARK = '#120025';    // Very dark, rich indigo (Used for main background/card blocks)
const COLOR_BACKGROUND_APP = '#0A0A0A';  // Very dark charcoal (Used for outer background/scroll area)
const COLOR_TEXT_ACCENT = '#F5E8C7';     // Soft gold/cream for highlights and active state
const COLOR_TEXT_LIGHT = '#FFFFFF';      // Pure white for primary text

// Gradients
const GRADIENT_HEADER_COLORS = ['#2C003E', '#1D0041']; // Deep Royal to Dark Violet (Header)
const GRADIENT_BUTTON_COLORS = ['#7B2CBF', '#9D4EDD']; // Vibrant Violet to Lighter Purple (Button/Accents)

// Placeholder Data
const hotelData = [
  { id: 'H1', name: 'Hotel A', imageUrl: 'https://hackathon-assets.com/nano-banana/hotel_a.jpg' },
  { id: 'H2', name: 'Hotel B', imageUrl: 'https://hackathon-assets.com/nano-banana/hotel_b.jpg' },
  { id: 'H3', name: 'Hotel C', imageUrl: 'https://hackathon-assets.com/nano-banana/hotel_c.jpg' },
];

const restaurantData = [
  { id: 'R1', name: 'Restaurant A', imageUrl: 'https://hackathon-assets.com/nano-banana/restaurant_a.jpg' },
  { id: 'R2', name: 'Restaurant B', imageUrl: 'https://hackathon-assets.com/nano-banana/restaurant_b.jpg' },
  { id: 'R3', name: 'Restaurant C', imageUrl: 'https://hackathon-assets.com/nano-banana/restaurant_c.jpg' },
];

// VeeHeader Component
const VeeHeader = ({ searchQuery, setSearchQuery, onSearch }) => (
  <View style={styles.headerContainer}>
    <LinearGradient
      colors={GRADIENT_HEADER_COLORS}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Hey, I&apos;m Vee! How can I help you?</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ask Vee..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor="transparent"
            contentStyle={styles.searchInputContent}
          />
          <TouchableOpacity onPress={onSearch} style={styles.searchButtonContainer}>
            <LinearGradient
              colors={GRADIENT_BUTTON_COLORS}
              style={styles.searchButton}
            >
              <MaterialCommunityIcons name="magnify" size={24} color={COLOR_TEXT_LIGHT} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  </View>
);

// BookingSection Component
const BookingSection = ({ title, data, onItemPress }) => (
  <View style={styles.bookingSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalScrollContent}
    >
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onItemPress(item)}
          style={styles.cardContainer}
        >
          <Card style={styles.card}>
            <Card.Cover
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
            />
            <View style={styles.cardNameContainer}>
              <Text style={styles.cardName}>{item.name}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

// Main SearchScreen Component
export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement search logic here
  };

  const handleItemPress = (item) => {
    console.log('Selected item:', item);
    // Implement item selection logic here
  };

  return (
    <View style={styles.container}>
      <VeeHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND_APP,
  },
  headerContainer: {
    overflow: 'hidden',
  },
  headerGradient: {
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLOR_TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLOR_TEXT_LIGHT,
    borderRadius: 25,
  },
  searchInputContent: {
    color: '#000',
    fontSize: 16,
  },
  searchButtonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90, // Prevent content from being obscured by tab bar
  },
  bookingSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_TEXT_LIGHT,
    marginBottom: 15,
  },
  horizontalScrollContent: {
    paddingRight: 20,
  },
  cardContainer: {
    marginRight: 15,
    width: 200,
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    height: 120,
  },
  cardNameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLOR_PRIMARY_DARK,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cardName: {
    color: COLOR_TEXT_ACCENT,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

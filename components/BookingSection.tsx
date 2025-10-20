import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { COLOR_TEXT_ACCENT, COLOR_TEXT_LIGHT } from '../constants/colors';
import { BookingItem } from '../types/booking';

interface BookingSectionProps {
  title: string;
  data: BookingItem[];
  onItemPress: (item: BookingItem) => void;
  showTitle?: boolean;
  compact?: boolean;
  horizontal?: boolean;
}

// Simple image component using React Native's Image
const BookingImage: React.FC<{ imageUrl: string; name: string }> = ({ imageUrl, name }) => {
  const [imageError, setImageError] = React.useState(false);

  const handleError = (error: any) => {
    console.log('❌ Image load error for', name, 'URL:', imageUrl, 'Error:', error);
    setImageError(true);
  };

  // Show error state
  if (imageError) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>🏨</Text>
        <Text style={styles.placeholderLabel}>Image</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={styles.cardImage}
      resizeMode="cover"
      onError={handleError}
    />
  );
};

const BookingSection: React.FC<BookingSectionProps> = ({ 
  title, 
  data, 
  onItemPress, 
  showTitle = true, 
  compact = false,
  horizontal = true 
}) => {
  const renderCard = (item: BookingItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => onItemPress(item)}
      style={[styles.cardContainer, compact && styles.compactCardContainer]}
    >
      <Card style={[styles.card, compact && styles.compactCard]}>
        <BookingImage imageUrl={item.imageUrl} name={item.name} />
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardNameContainer}
        >
          <Text style={[styles.cardName, compact && styles.compactCardName]}>{item.name}</Text>
          {item.price && (
            <Text style={[styles.cardPrice, compact && styles.compactCardPrice]}>{item.price}</Text>
          )}
        </LinearGradient>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.bookingSection, compact && styles.compactBookingSection]}>
      {showTitle && <Text style={[styles.sectionTitle, compact && styles.compactSectionTitle]}>{title}</Text>}
      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {data.map(renderCard)}
        </ScrollView>
      ) : (
        <View style={styles.verticalContainer}>
          {data.map(renderCard)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bookingSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  compactBookingSection: {
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_TEXT_LIGHT,
    marginBottom: 15,
  },
  compactSectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  horizontalScrollContent: {
    paddingRight: 20,
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  cardContainer: {
    marginRight: 15,
    width: 200,
  },
  compactCardContainer: {
    marginRight: 8,
    width: 160,
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
  compactCard: {
    borderRadius: 12,
    elevation: 3,
  },
  cardImage: {
    height: 120,
  },
  cardNameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  cardName: {
    color: COLOR_TEXT_ACCENT,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  compactCardName: {
    fontSize: 12,
  },
  cardPrice: {
    color: COLOR_TEXT_LIGHT,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  compactCardPrice: {
    fontSize: 10,
  },
  placeholderContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default BookingSection;

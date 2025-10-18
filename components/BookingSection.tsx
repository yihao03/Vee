import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { COLOR_TEXT_ACCENT, COLOR_TEXT_LIGHT } from '../constants/colors';

interface BookingItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface BookingSectionProps {
  title: string;
  data: BookingItem[];
  onItemPress: (item: BookingItem) => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({ title, data, onItemPress }) => (
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
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardNameContainer}
            >
              <Text style={styles.cardName}>{item.name}</Text>
            </LinearGradient>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
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
});

export default BookingSection;

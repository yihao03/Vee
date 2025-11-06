import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  COLOR_BACKGROUND_APP,
  COLOR_PRIMARY_DARK,
  COLOR_TEXT_ACCENT,
  COLOR_TEXT_LIGHT,
} from '../../../constants/colors';
import { geminiService } from '../../../services/geminiService';
import { BookingItem } from '../../../types/booking';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND_APP,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: width,
    height: height * 0.4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLOR_TEXT_LIGHT,
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: COLOR_TEXT_ACCENT,
  },
  detailsContainer: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLOR_TEXT_LIGHT,
    marginBottom: 30,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_TEXT_ACCENT,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: COLOR_TEXT_LIGHT,
  },
  bookButton: {
    backgroundColor: COLOR_TEXT_ACCENT,
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: COLOR_TEXT_ACCENT,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR_BACKGROUND_APP,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLOR_TEXT_ACCENT,
  },
  cardInfo: {
    backgroundColor: 'rgba(245, 232, 199, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 232, 199, 0.3)',
  },
  cardInfoText: {
    fontSize: 14,
    color: COLOR_TEXT_ACCENT,
    textAlign: 'center',
  },
});

export default function BookingDetailScreen() {
  const { item } = useLocalSearchParams<{ item: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cabModalVisible, setCabModalVisible] = useState(false);
  const [cabSuggestions, setCabSuggestions] = useState<BookingItem[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Parse the booking item from the route params
  const bookingItem: BookingItem = item ? JSON.parse(item) : {
    id: '',
    name: 'Unknown Item',
    imageUrl: '',
    short_description: 'No description available',
    price: 'N/A'
  };

  const mockFeatures = [
    { icon: 'wifi', text: 'Free WiFi' },
    { icon: 'car', text: 'Parking Available' },
    { icon: 'food', text: 'Restaurant On-Site' },
    { icon: 'swim', text: 'Swimming Pool' },
    { icon: 'spa', text: 'Spa Services' },
    { icon: 'airplane', text: 'Airport Shuttle' },
  ];

  const simulateTransaction = async () => {
    setIsProcessing(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // Simulate random success/failure (90% success rate)
      const isSuccess = Math.random() > 0.001;

      if (isSuccess) {
        // Trigger cab booking follow-up by sending a message to the AI and awaiting the response
        const bookingConfirmationMessage = `I just successfully booked ${bookingItem.name} for ${bookingItem.price}. The booking is confirmed and paid for.`;
        let cabFollowUpText: string | undefined;
        let cabOptionNames: string[] | undefined;
        try {
          const aiResponse = await geminiService.sendMessage(bookingConfirmationMessage);
          if (aiResponse && aiResponse.message) {
            cabFollowUpText = aiResponse.message;
          }
          if (aiResponse && aiResponse.suggestions && Array.isArray(aiResponse.suggestions)) {
            setCabSuggestions(aiResponse.suggestions as BookingItem[]);
            cabOptionNames = aiResponse.suggestions.map((s: any) => s?.name).filter(Boolean);
          }
        } catch (e) {
          console.log('Cab follow-up trigger failed:', e);
        }

        setConfirmMessage(
          `Your booking for ${bookingItem.name} has been successfully processed using your GlobeTrotter+ Visa card.\n\nTransaction ID: GT${Date.now()}\nAmount: ${bookingItem.price}\n\nYou will receive a confirmation email shortly.`
        );
        setConfirmModalVisible(true);
      } else {
        Alert.alert(
          'Transaction Failed',
          'We encountered an issue processing your payment. Please check your card details and try again.',
          [
            { text: 'Try Again', onPress: () => setIsProcessing(false) },
            { text: 'Cancel', onPress: () => router.back() }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong. Please try again later.',
        [{ text: 'OK', onPress: () => setIsProcessing(false) }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: bookingItem.imageUrl || 'https://via.placeholder.com/400x300/0B1545/F5E8C7?text=No+Image' }}
            style={styles.image}
          />
          <LinearGradient
            colors={['transparent', 'rgba(11, 21, 69, 0.85)']}
            style={styles.imageOverlay}
          >
            <Text style={styles.title}>{bookingItem.name}</Text>
            <Text style={styles.price}>{bookingItem.price}</Text>
          </LinearGradient>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.description}>
            {bookingItem.long_description || bookingItem.short_description || 'Experience luxury and comfort at this amazing location. Perfect for your next getaway, this venue offers world-class amenities and exceptional service that will make your stay unforgettable.'}
          </Text>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What's Included</Text>
            {mockFeatures.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialCommunityIcons
                  name={feature.icon as any}
                  size={20}
                  color={COLOR_TEXT_ACCENT}
                  style={styles.featureIcon}
                />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoText}>
              💳 Payment will be processed using your GlobeTrotter+ Visa card
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={simulateTransaction}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLOR_PRIMARY_DARK} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        ) : (
          <Text style={styles.bookButtonText}>Book Now</Text>
        )}
      </TouchableOpacity>

      {/* Cab Options Modal */}
      <Modal
        transparent
        visible={cabModalVisible}
        animationType="fade"
        onRequestClose={() => setCabModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: COLOR_BACKGROUND_APP, borderRadius: 16, padding: 20 }}>
            <Text style={{ color: COLOR_TEXT_LIGHT, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
              Choose a cab option
            </Text>
            {cabSuggestions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={{
                  backgroundColor: 'rgba(245, 232, 199, 0.1)',
                  borderColor: 'rgba(245, 232, 199, 0.3)',
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  marginBottom: 10,
                }}
                onPress={() => {
                  setCabModalVisible(false);
                  Alert.alert('Cab selected', `You chose ${opt.name}.`);
                }}
              >
                <Text style={{ color: COLOR_TEXT_ACCENT, fontWeight: '600', fontSize: 16 }}>{opt.name}</Text>
                {!!opt.short_description && (
                  <Text style={{ color: COLOR_TEXT_LIGHT, marginTop: 4 }}>{opt.short_description}</Text>
                )}
                {!!opt.price && (
                  <Text style={{ color: COLOR_TEXT_LIGHT, marginTop: 4 }}>Price: {opt.price}</Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setCabModalVisible(false)}
              style={{ alignSelf: 'flex-end', marginTop: 8 }}
            >
              <Text style={{ color: COLOR_TEXT_ACCENT, fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Booking Confirmation Modal (uniform styling) */}
      <Modal
        transparent
        visible={confirmModalVisible}
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: COLOR_BACKGROUND_APP, borderRadius: 16, padding: 20 }}>
            <Text style={{ color: COLOR_TEXT_LIGHT, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
              Booking Confirmed! 🎉
            </Text>
            <Text style={{ color: COLOR_TEXT_LIGHT, marginBottom: 16, lineHeight: 20 }}>
              {confirmMessage}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  // Open cab modal
                  setConfirmModalVisible(false);
                  if (!cabSuggestions || cabSuggestions.length === 0) {
                    setCabSuggestions([
                      { id: 'cab-1', name: 'Uber', imageUrl: '', short_description: 'Ride-sharing', price: 'Varies' },
                      { id: 'cab-2', name: 'Lyft', imageUrl: '', short_description: 'Ride-sharing', price: 'Varies' },
                      { id: 'cab-3', name: 'Local Taxi', imageUrl: '', short_description: 'Metered taxi', price: 'Metered' },
                    ] as BookingItem[]);
                  }
                  setCabModalVisible(true);
                }}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: COLOR_TEXT_ACCENT, fontWeight: '600' }}>Book a Cab</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setConfirmModalVisible(false);
                  router.back();
                }}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: COLOR_TEXT_ACCENT, fontWeight: '600' }}>View Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setConfirmModalVisible(false); router.back(); }}>
                <Text style={{ color: COLOR_TEXT_ACCENT, fontWeight: '600' }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { COLOR_TEXT_ACCENT, COLOR_TEXT_LIGHT, GRADIENT_HEADER_COLORS } from '../constants/colors';

interface VeeHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchPress: () => void;
  isChatMode: boolean;
}

const VeeHeader: React.FC<VeeHeaderProps> = ({ searchQuery, setSearchQuery, onSearchPress, isChatMode }) => (
  <View style={[styles.headerContainer, isChatMode && styles.headerContainerChat]}>
    <LinearGradient
      colors={GRADIENT_HEADER_COLORS as readonly [string, string]}
      style={[styles.headerGradient, isChatMode && styles.headerGradientChat]}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Hey, I&apos;m Vee! How can I help you?</Text>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Ask Vee..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, isChatMode && styles.searchBarChat]}
            inputStyle={styles.searchBarInput}
            iconColor={COLOR_TEXT_ACCENT}
            placeholderTextColor="#999"
            onFocus={onSearchPress}
            theme={{
              colors: {
                primary: COLOR_TEXT_ACCENT,
                onSurface: COLOR_TEXT_LIGHT,
                surface: COLOR_TEXT_LIGHT,
              },
            }}
          />
        </View>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    overflow: 'hidden',
  },
  headerContainerChat: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerGradient: {
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerGradientChat: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 40,
    paddingBottom: 20,
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
    width: '100%',
  },
  searchBar: {
    backgroundColor: COLOR_TEXT_LIGHT,
    borderRadius: 25,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchBarChat: {
    borderRadius: 20,
  },
  searchBarInput: {
    color: '#000',
    fontSize: 16,
  },
});

export default VeeHeader;

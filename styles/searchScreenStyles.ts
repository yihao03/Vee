import { Dimensions, StyleSheet } from 'react-native';
import { COLOR_BACKGROUND_APP, COLOR_CHAT_BG } from '../constants/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const searchScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND_APP,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90, // Prevent content from being obscured by tab bar
  },
  chatOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLOR_CHAT_BG,
  },
});

export { SCREEN_HEIGHT };

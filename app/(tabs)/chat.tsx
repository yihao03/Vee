import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Color Palette
const COLOR_BACKGROUND_APP = '#0A0A0A';
const COLOR_TEXT_LIGHT = '#FFFFFF';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Screen - Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND_APP,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLOR_TEXT_LIGHT,
    fontSize: 18,
  },
});

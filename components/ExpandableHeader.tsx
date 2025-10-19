import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Searchbar, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    COLOR_CHAT_BG,
    COLOR_PRIMARY_DARK,
    COLOR_TEXT_ACCENT,
    COLOR_TEXT_LIGHT,
    GRADIENT_HEADER_COLORS
} from '../constants/colors';
import ChatMessage from './ChatMessage';

const HEADER_COLLAPSED_HEIGHT = 200;
const HEADER_EXPANDED_HEIGHT = 60;
const SEARCH_TRANSITION_OFFSET = HEADER_COLLAPSED_HEIGHT - HEADER_EXPANDED_HEIGHT;

interface Message {
  text: string;
  isUser: boolean;
}

interface ExpandableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSendMessage: () => void;
  onBackToHome: () => void;
  onSearchFocus: () => void;
  isExpanded: boolean;
  messages: Message[];
  isLoading?: boolean;
}

const ExpandableHeader: React.FC<ExpandableHeaderProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  onSendMessage, 
  onBackToHome,
  onSearchFocus,
  isExpanded,
  messages,
  isLoading = false
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const headerHeight = (isExpanded ? HEADER_EXPANDED_HEIGHT : HEADER_COLLAPSED_HEIGHT) + insets.top;
  const headerPaddingTop = (isExpanded ? 10 : 60) + insets.top;
  const keyboardVerticalOffset = HEADER_EXPANDED_HEIGHT + insets.top;

  useEffect(() => {
    // Animate between states
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-scroll to bottom when new messages are added
    if (isExpanded) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isExpanded, messages, slideAnim]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        if (isExpanded) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      });

      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
      });

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, [isExpanded]);

  const handleSearchPress = (): void => {
    onSearchFocus();
  };

  // Animated values
  const titleOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const expandedOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const chatTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SEARCH_TRANSITION_OFFSET, 0],
  });

  const chatContainerOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const searchBarOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const searchBarTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SEARCH_TRANSITION_OFFSET / 2],
  });

  const chatInputOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const chatInputTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SEARCH_TRANSITION_OFFSET, 0],
  });

  return (
    <View style={[styles.container, isExpanded ? styles.containerExpanded : styles.containerCollapsed]}>
      {/* Animated Header */}
      <View
        style={[
          styles.headerContainer,
          { height: headerHeight },
        ]}
      >
        <LinearGradient
          colors={GRADIENT_HEADER_COLORS as readonly [string, string]}
          style={[
            styles.headerGradient,
            isExpanded ? styles.headerGradientExpanded : styles.headerGradientCollapsed,
            { 
              paddingTop: headerPaddingTop,
              borderBottomLeftRadius: isExpanded ? 0 : 50,
              borderBottomRightRadius: isExpanded ? 0 : 50,
            },
          ]}
        >
          <View style={styles.headerContent}>
            {/* Collapsed state title */}
            <Animated.Text style={[styles.headerTitle, { opacity: titleOpacity }]}>
              Hey, I&apos;m Vee! How can I help you?
            </Animated.Text>
            
            {/* Search bar */}
            <Animated.View
              style={[styles.searchContainer, {
                opacity: searchBarOpacity,
                transform: [{ translateY: searchBarTranslateY }],
              }]}
              pointerEvents={isExpanded ? 'none' : 'auto'}
            >
              <Searchbar
                placeholder="Ask Vee..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.searchBarInput}
                iconColor={COLOR_TEXT_ACCENT}
                placeholderTextColor="#999"
                onFocus={handleSearchPress}
                editable={!isExpanded}
                theme={{
                  colors: {
                    primary: COLOR_TEXT_ACCENT,
                    onSurface: COLOR_TEXT_LIGHT,
                    surface: COLOR_TEXT_LIGHT,
                  },
                }}
              />
            </Animated.View>

            {/* Expanded state header with back button */}
            <Animated.View style={[styles.expandedHeaderContent, { opacity: expandedOpacity }]}>
              <TouchableOpacity onPress={onBackToHome} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={COLOR_TEXT_LIGHT} />
              </TouchableOpacity>
              <Text style={styles.expandedHeaderTitle}>Chat with Vee</Text>
              <View style={styles.placeholder} />
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      {/* Animated Chat Container */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.chatContainer,
            {
              transform: [{ translateY: chatTranslateY }],
              opacity: chatContainerOpacity,
            },
          ]}
          pointerEvents="auto"
        >
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset : 0}
          enabled={Platform.OS === 'ios' && isExpanded}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.chatContent}>
              {/* Messages container */}
              <View style={styles.messagesContainer}>
                <ScrollView 
                  ref={scrollViewRef}
                  style={styles.messagesScrollView}
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
                  {isLoading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={COLOR_TEXT_ACCENT} />
                      <Text style={styles.loadingText}>Vee is thinking...</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
              
              {/* Input container */}
              <Animated.View
                style={[styles.chatInputContainer, {
                  opacity: chatInputOpacity,
                  transform: [{ translateY: chatInputTranslateY }],
                  marginBottom: Platform.OS === 'android' ? keyboardHeight : 0,
                }]}
                pointerEvents={isExpanded ? 'auto' : 'none'}
              >
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
                  <TouchableOpacity 
                    onPress={onSendMessage} 
                    style={styles.sendButton}
                    disabled={isLoading || !searchQuery.trim()}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color={COLOR_TEXT_LIGHT} />
                    ) : (
                      <MaterialCommunityIcons name="send" size={24} color={COLOR_TEXT_LIGHT} />
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base container styles
  },
  containerExpanded: {
    flex: 1,
  },
  containerCollapsed: {
    // No flex, so it only takes the space it needs
  },
  headerContainer: {
    overflow: 'hidden',
    zIndex: 10,
    elevation: 10,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerGradientCollapsed: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  headerGradientExpanded: {
    paddingTop: 10,
    paddingBottom: 0,
  },
  headerContent: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
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
  searchBarInput: {
    color: '#000',
    fontSize: 16,
  },
  expandedHeaderContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 15,
    elevation: 15,
  },
  backButton: {
    padding: 5,
  },
  expandedHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR_TEXT_LIGHT,
  },
  placeholder: {
    width: 34, // Same width as back button for centering
  },
  chatContainer: {
    flex: 1,
    backgroundColor: COLOR_CHAT_BG,
    zIndex: 1,
    elevation: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  chatContent: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesScrollView: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  chatInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 20,
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
    backgroundColor: 'transparent',
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
    alignSelf: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: COLOR_TEXT_ACCENT,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default ExpandableHeader;

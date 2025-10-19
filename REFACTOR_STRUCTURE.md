# Refactored Codebase Structure

## 📁 File Organization

### Constants
- `constants/colors.js` - Color palette and gradient definitions
- `constants/data.js` - Placeholder data and AI response templates
- `constants/index.js` - Barrel export for all constants

### Components
- `components/ExpandableHeader.js` - Animated header that expands into chat interface
- `components/ChatMessage.js` - Individual chat message component
- `components/BookingSection.js` - Horizontal scrollable booking sections
- `components/index.js` - Barrel export for all components

### Styles
- `styles/searchScreenStyles.js` - Main screen styles and dimensions

### Main Screen
- `app/(tabs)/index.js` - Refactored main SearchScreen component

## 🔄 Benefits of Refactoring

1. **Smooth Animations**: Seamless transition between search header and chat interface
2. **Single Component**: Unified ExpandableHeader handles both states with animations
3. **Better UX**: No jarring state changes, smooth user experience
4. **Maintainability**: Easier to find and modify specific functionality
5. **Clean Imports**: Barrel exports make imports cleaner and more organized
6. **Constants Management**: Centralized color palette and data management
7. **Scalability**: Easy to add new components and features

## 📦 Import Examples

```javascript
// Clean component imports
import { ExpandableHeader, BookingSection } from '../../components';

// Clean constant imports
import { COLOR_PRIMARY_DARK, hotelData, AI_RESPONSES } from '../../constants';
```

## 🎯 Component Responsibilities

- **ExpandableHeader**: Animated search header that smoothly expands into full chat interface
- **ChatMessage**: Individual message rendering
- **BookingSection**: Horizontal scrollable content sections
- **SearchScreen**: Main screen orchestration and state management

## 🎨 Animation Features

- **Smooth Height Transitions**: Header smoothly expands from collapsed to full chat view
- **Opacity Animations**: Messages and input fade in/out with proper timing
- **Corner Radius Animation**: Rounded corners smoothly transition to sharp edges
- **Scale Effects**: Search bar subtly scales during transitions
- **Layered Animations**: Multiple animated properties working in harmony

# Refactored Codebase Structure

## 📁 File Organization

### Constants
- `constants/colors.js` - Color palette and gradient definitions
- `constants/data.js` - Placeholder data and AI response templates
- `constants/index.js` - Barrel export for all constants

### Components
- `components/VeeHeader.js` - Header component with search bar
- `components/ChatInterface.js` - Full-screen chat interface
- `components/ChatMessage.js` - Individual chat message component
- `components/BookingSection.js` - Horizontal scrollable booking sections
- `components/index.js` - Barrel export for all components

### Styles
- `styles/searchScreenStyles.js` - Main screen styles and dimensions

### Main Screen
- `app/(tabs)/index.js` - Refactored main SearchScreen component

## 🔄 Benefits of Refactoring

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused across the app
3. **Maintainability**: Easier to find and modify specific functionality
4. **Clean Imports**: Barrel exports make imports cleaner and more organized
5. **Constants Management**: Centralized color palette and data management
6. **Scalability**: Easy to add new components and features

## 📦 Import Examples

```javascript
// Clean component imports
import { VeeHeader, ChatInterface, BookingSection } from '../../components';

// Clean constant imports
import { COLOR_PRIMARY_DARK, hotelData, AI_RESPONSES } from '../../constants';
```

## 🎯 Component Responsibilities

- **VeeHeader**: Search bar and header display
- **ChatInterface**: Full chat experience with message list and input
- **ChatMessage**: Individual message rendering
- **BookingSection**: Horizontal scrollable content sections
- **SearchScreen**: Main screen orchestration and state management

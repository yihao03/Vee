export interface Hotel {
  name: string;
  short_description: string;
  long_description: string;
  price: string;
  image_url: string;
}

export interface Restaurant {
  name: string;
  short_description: string;
  long_description: string;
  price: string;
  image_url: string;
}

// Match the existing BookingItem interface from BookingSection
export interface BookingItem {
  id: string;
  name: string;
  imageUrl: string;
  short_description?: string;
  long_description?: string;
  price?: string;
}

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: Date;
  suggestions?: BookingItem[];
  messageType?: 'text' | 'suggestions' | 'selection';
}

export interface SelectedItem {
  item: BookingItem;
  selectedAt: Date;
}

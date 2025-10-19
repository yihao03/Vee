import partnersData from '../partners/all.json';
import { BookingItem, Hotel, Restaurant } from '../types/booking';

class BookingService {
  private hotels: Hotel[];
  private restaurants: Restaurant[];

  constructor() {
    this.hotels = partnersData.hotels;
    this.restaurants = partnersData.restaurants;
  }

  /**
   * Search for hotels based on query
   */
  searchHotels(query: string, limit: number = 3): BookingItem[] {
    const searchTerm = query.toLowerCase();
    
    return this.hotels
      .filter(hotel => 
        hotel.name.toLowerCase().includes(searchTerm) ||
        hotel.short_description.toLowerCase().includes(searchTerm) ||
        hotel.long_description.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit)
      .map(hotel => ({
        id: `hotel_${hotel.name.replace(/\s+/g, '_').toLowerCase()}`,
        name: hotel.name,
        imageUrl: hotel.image_url,
        short_description: hotel.short_description,
        price: hotel.price
      }));
  }

  /**
   * Search for restaurants based on query
   */
  searchRestaurants(query: string, limit: number = 3): BookingItem[] {
    const searchTerm = query.toLowerCase();
    
    return this.restaurants
      .filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.short_description.toLowerCase().includes(searchTerm) ||
        restaurant.long_description.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit)
      .map(restaurant => ({
        id: `restaurant_${restaurant.name.replace(/\s+/g, '_').toLowerCase()}`,
        name: restaurant.name,
        imageUrl: restaurant.image_url,
        short_description: restaurant.short_description,
        price: restaurant.price
      }));
  }

  /**
   * Get random hotel recommendations
   */
  getRandomHotels(limit: number = 3): BookingItem[] {
    const shuffled = [...this.hotels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit).map(hotel => ({
      id: `hotel_${hotel.name.replace(/\s+/g, '_').toLowerCase()}`,
      name: hotel.name,
      imageUrl: hotel.image_url,
      short_description: hotel.short_description,
      price: hotel.price
    }));
  }

  /**
   * Get random restaurant recommendations
   */
  getRandomRestaurants(limit: number = 3): BookingItem[] {
    const shuffled = [...this.restaurants].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit).map(restaurant => ({
      id: `restaurant_${restaurant.name.replace(/\s+/g, '_').toLowerCase()}`,
      name: restaurant.name,
      imageUrl: restaurant.image_url,
      short_description: restaurant.short_description,
      price: restaurant.price
    }));
  }

}

export default new BookingService();

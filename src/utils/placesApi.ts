
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Get the URL and key from environment variables, or use empty strings as fallbacks
// to prevent the immediate error, then handle the missing values gracefully
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create the Supabase client only if we have valid credentials
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

const supabase = createSupabaseClient();

interface PlaceResult {
  name: string;
  vicinity: string;
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { open_now: boolean };
}

interface PlacesResponse {
  results: PlaceResult[];
  status: string;
  error_message?: string;
}

export interface FoodPlaceRecommendation {
  name: string;
  address: string;
  priceLevel: number;
  rating?: number;
  isOpenNow?: boolean;
}

/**
 * Estimates the price range in rupees based on Google's price level
 * @param priceLevel Google's price level (0-4)
 */
export const estimatePriceRange = (priceLevel: number = 1): string => {
  switch (priceLevel) {
    case 0:
      return '₹20-50';
    case 1:
      return '₹50-100';
    case 2:
      return '₹100-300';
    case 3:
      return '₹300-600';
    case 4:
      return '₹600+';
    default:
      return 'Price unavailable';
  }
};

/**
 * Converts price in rupees to Google's price level (0-4)
 * @param budget Budget in rupees
 */
export const budgetToPriceLevel = (budget: number): number => {
  if (budget < 50) return 0;
  if (budget < 100) return 1;
  if (budget < 300) return 2;
  if (budget < 600) return 3;
  return 4;
};

/**
 * Fetch nearby food places based on budget constraint
 * @param budget Budget in rupees
 * @param keyword Optional search keyword
 */
export const fetchNearbyFoodPlaces = async (
  budget: number,
  keyword: string = 'food'
): Promise<FoodPlaceRecommendation[]> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      console.error('Supabase client is not initialized. Cannot fetch places.');
      return [];
    }

    // Convert budget to price level (0-4)
    const maxPriceLevel = budgetToPriceLevel(budget);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('places', {
      body: {
        maxprice: maxPriceLevel,
        keyword: keyword,
        radius: 2000, // 2km radius
      },
    });

    if (error) {
      console.error('Error fetching places:', error);
      return [];
    }

    const placesResponse = data as PlacesResponse;
    
    if (placesResponse.status !== 'OK') {
      console.error('Places API error:', placesResponse.error_message);
      return [];
    }

    // Map the Google Places results to our app format
    return placesResponse.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      priceLevel: place.price_level || 0,
      rating: place.rating,
      isOpenNow: place.opening_hours?.open_now,
    })).slice(0, 5); // Limit to 5 results
  } catch (error) {
    console.error('Error in fetchNearbyFoodPlaces:', error);
    return [];
  }
};

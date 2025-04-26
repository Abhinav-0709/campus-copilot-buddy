import { getGeminiResponse } from './aiService';
import { mockResponses, menuItems } from '@/data/mockData';
import { fetchNearbyFoodPlaces, estimatePriceRange } from '@/utils/placesApi';

export const getPersonalizedResponse = async (query: string, studentData: any[]): Promise<string> => {
  const lowerQuery = query.toLowerCase();
  const greetings = ["Hi!", "Hello!", "Hey there!", "Greetings!", "Hi friend!"];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  try {
    if (lowerQuery.includes('rupees') || lowerQuery.includes('rs')) {
      const budgetMatch = query.match(/(\d+)\s*(?:rupees|rs)/i);
      if (budgetMatch) {
        const budget = parseInt(budgetMatch[1]);
        
        try {
          const places = await fetchNearbyFoodPlaces(budget);
          
          if (places && places.length > 0) {
            let response = `${randomGreeting} With a budget of ₹${budget}, here are some nearby places you can try:\n\n`;
            
            places.forEach(place => {
              const priceRange = estimatePriceRange(place.priceLevel);
              response += `• ${place.name} - ${priceRange}\n`;
              response += `  ${place.address}\n`;
              if (place.rating) response += `  Rating: ${place.rating}/5\n`;
              response += `  ${place.isOpenNow ? '🟢 Open now' : '🔴 Closed'}\n\n`;
            });
            
            response += "These recommendations are based on your location and budget. Enjoy your meal! 🍽️";
            return response;
          }
          
          return getFallbackFoodRecommendation(budget, randomGreeting);
        } catch (error) {
          console.error('Error fetching food places:', error);
          return getFallbackFoodRecommendation(budget, randomGreeting);
        }
      }
    }

    if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('restaurant') || lowerQuery.includes('menu')) {
      try {
        const places = await fetchNearbyFoodPlaces(200, 'restaurant');
        
        if (places && places.length > 0) {
          let response = `${randomGreeting} Here are some food places near you:\n\n`;
          
          places.forEach(place => {
            const priceRange = estimatePriceRange(place.priceLevel);
            response += `• ${place.name} - ${priceRange}\n`;
            response += `  ${place.address}\n`;
            if (place.rating) response += `  Rating: ${place.rating}/5\n\n`;
          });
          
          response += "\nYou can also ask me what's available within your budget! For example, 'What can I get for 100 rupees?' 🍽️";
          return response;
        }
        
        return `${randomGreeting}\n\n${mockResponses.food}\n\nOur Menu Highlights:\n${menuItems
          .slice(0, 5)
          .map(item => `• ${item.name} - ₹${item.price} (${item.description})`)
          .join('\n')}\n\nYou can also ask me what you can get within your budget! 🍽️`;
      } catch (error) {
        console.error('Error fetching food places:', error);
        return `${randomGreeting}\n\n${mockResponses.food}\n\nOur Menu Highlights:\n${menuItems
          .slice(0, 5)
          .map(item => `• ${item.name} - ₹${item.price} (${item.description})`)
          .join('\n')}\n\nYou can also ask me what you can get within your budget! 🍽️`;
      }
    }

    // For specific categories, use mock responses
    for (const [key, response] of Object.entries(mockResponses)) {
      if (lowerQuery.includes(key)) {
        return `${randomGreeting}\n\n${response}`;
      }
    }

    // For all other queries, try to use Gemini
    try {
      return await getGeminiResponse(query);
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      return `${randomGreeting}\n\nI'm still learning to answer that type of question. Could you try asking something about campus life, food options, exams, or assignments?`;
    }
    
  } catch (error) {
    console.error('Error getting response:', error);
    return "I apologize, but I encountered an error processing your request. Please try again.";
  }
};

export const getFallbackFoodRecommendation = (budget: number, greeting: string): string => {
  const affordableItems = menuItems.filter(item => item.price <= budget);
  
  if (affordableItems.length === 0) {
    return `${greeting} I'm sorry, but the minimum item in our menu starts from ₹15. You might want to check back when you have a bigger budget! 💰`;
  }

  const categorizedItems = affordableItems.reduce((acc: Record<string, typeof menuItems>, item) => {
    acc[item.category] = [...(acc[item.category] || []), item];
    return acc;
  }, {});

  let response = `${greeting} With ₹${budget}, you can get these items from our menu:\n\n`;
  
  Object.entries(categorizedItems).forEach(([category, items]) => {
    response += `${category.toUpperCase()}:\n`;
    items.forEach(item => {
      response += `• ${item.name} (₹${item.price}) - ${item.description}\n`;
    });
    response += '\n';
  });

  return response + "Enjoy your meal! 🍽️\n\n(This is showing our campus menu as I couldn't connect to the location service)";
};

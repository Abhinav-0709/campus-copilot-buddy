
import { createSupabaseClient } from '@/utils/placesApi';

const supabase = createSupabaseClient();

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    if (!supabase) {
      console.error('Supabase client is not initialized. Cannot call Gemini API.');
      return `I'm sorry, I can't connect to my AI service right now. Please check that you have set up your Supabase credentials in the environment variables.`;
    }
    
    const { data, error } = await supabase.functions.invoke('gemini', {
      body: { prompt }
    });

    if (error) {
      console.error('Error from Gemini API:', error);
      throw error;
    }
    
    return data.response;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `I'm sorry, I encountered an error while processing your request. Please try again later or check if the Gemini API key is configured correctly.`;
  }
};


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY") || "";

interface PlacesRequestParams {
  location?: string;
  radius?: number;
  maxprice?: number;
  type?: string;
  keyword?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { location = "28.6139,77.2090", radius = 1000, maxprice = 2, type = "restaurant", keyword = "food" } = 
      await req.json() as PlacesRequestParams;

    // Validate API key
    if (!GOOGLE_PLACES_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "GOOGLE_PLACES_API_KEY is not set in environment variables"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Build Google Places API URL
    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.append("location", location);
    url.searchParams.append("radius", radius.toString());
    url.searchParams.append("maxprice", maxprice.toString());
    url.searchParams.append("type", type);
    url.searchParams.append("keyword", keyword);
    url.searchParams.append("key", GOOGLE_PLACES_API_KEY);
    
    // Fetch data from Google Places API
    const response = await fetch(url.toString());
    const data = await response.json();
    
    // Return the places data
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

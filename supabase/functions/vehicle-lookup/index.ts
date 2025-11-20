import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VehicleLookupRequest {
  vin?: string;
  plate?: string;
  state?: string;
}

// Rate limiting map (in-memory, resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60000; // 1 minute in milliseconds

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

async function decodeVIN(vin: string) {
  console.log(`Decoding VIN: ${vin}`);
  
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
    );
    
    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform NHTSA response to our format
    const results = data.Results || [];
    const getValue = (variableId: number) => {
      const item = results.find((r: any) => r.VariableId === variableId);
      return item?.Value || null;
    };

    return {
      vin,
      make: getValue(26),
      model: getValue(28),
      year: getValue(29),
      manufacturer: getValue(27),
      vehicleType: getValue(10),
      bodyClass: getValue(5),
      engineConfiguration: getValue(64),
      engineCylinders: getValue(9),
      displacement: getValue(11),
      fuelType: getValue(24),
      transmission: getValue(37),
      driveType: getValue(15),
      doors: getValue(14),
      plantCity: getValue(31),
      plantCountry: getValue(75),
    };
  } catch (error) {
    console.error("Error decoding VIN:", error);
    throw new Error("Failed to decode VIN from NHTSA");
  }
}

async function lookupPlate(plate: string, state: string) {
  console.log(`Looking up plate: ${plate} in state: ${state}`);
  
  // PLACEHOLDER: This is where you would integrate with your paid provider
  // For now, we return mock data
  return {
    plate: {
      number: plate,
      state: state,
      expiration: "12/2025",
    },
    // In production, your plate lookup service would return a VIN
    // which you would then pass to decodeVIN()
    vin: null, // Placeholder - would come from paid service
  };
}

async function getVehicleHistory(vin: string) {
  console.log(`Getting vehicle history for VIN: ${vin}`);
  
  // PLACEHOLDER: This is where you would integrate with NMVTIS or VinAudit
  // For now, we return mock data
  return {
    title: "Clean",
    accidents: 0,
    owners: 1,
    service: "Regular maintenance records available",
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestData: VehicleLookupRequest = await req.json();
    console.log('Request data:', requestData);

    let vehicleData: any = {};
    let vinToLookup: string | null = null;

    // Validate input
    if (requestData.vin) {
      // VIN lookup
      const cleanVin = requestData.vin.trim().toUpperCase();
      
      if (cleanVin.length !== 17) {
        return new Response(
          JSON.stringify({ error: 'VIN must be exactly 17 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (/[IOQ]/i.test(cleanVin)) {
        return new Response(
          JSON.stringify({ error: 'VIN cannot contain the letters I, O, or Q' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      vinToLookup = cleanVin;
      vehicleData = await decodeVIN(vinToLookup);

    } else if (requestData.plate && requestData.state) {
      // License plate lookup
      const plateData = await lookupPlate(
        requestData.plate.trim().toUpperCase(),
        requestData.state
      );
      
      vehicleData = { ...plateData };
      
      // If plate lookup returned a VIN, decode it
      if (plateData.vin) {
        vinToLookup = plateData.vin;
        const vinData = await decodeVIN(vinToLookup);
        vehicleData = { ...vehicleData, ...vinData };
      }

    } else {
      return new Response(
        JSON.stringify({ error: 'Either VIN or (plate + state) must be provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get vehicle history if we have a VIN
    if (vinToLookup) {
      const history = await getVehicleHistory(vinToLookup);
      vehicleData.history = history;
    }

    console.log('Returning vehicle data:', vehicleData);

    return new Response(
      JSON.stringify(vehicleData),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in vehicle-lookup:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

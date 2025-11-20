import { useState, useEffect } from "react";
import { VehicleLookupForm } from "@/components/VehicleLookupForm";
import { VehicleResults } from "@/components/VehicleResults";
import { Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import engine1 from "@/assets/engine-1.png";
import engine2 from "@/assets/engine-2.png";
import engine3 from "@/assets/engine-3.png";

export interface VehicleData {
  vin?: string;
  make?: string;
  model?: string;
  year?: string;
  manufacturer?: string;
  vehicleType?: string;
  bodyClass?: string;
  engineConfiguration?: string;
  engineCylinders?: string;
  displacement?: string;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  doors?: string;
  plantCity?: string;
  plantCountry?: string;
  history?: {
    title: string;
    accidents: number;
    owners: number;
    service: string;
  };
  plate?: {
    number: string;
    state: string;
    expiration: string;
  };
  [key: string]: any;
}

const Index = () => {
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLookup = async (data: VehicleData) => {
    setIsLoading(true);
    setVehicleData(null);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('vehicle-lookup', {
        body: {
          vin: data.vin,
          plate: data.plate?.number,
          state: data.plate?.state
        }
      });

      if (error) {
        console.error('API Error:', error);
        toast.error(error.message || 'Failed to lookup vehicle');
        return;
      }

      if (!result) {
        toast.error('No vehicle data found');
        return;
      }

      setVehicleData(result);
      toast.success('Vehicle data retrieved successfully!');
      
    } catch (error) {
      console.error('Lookup error:', error);
      toast.error('Failed to lookup vehicle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section with Floating Engines */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        {/* Floating Engines */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={engine1} 
            alt="" 
            className="absolute w-[500px] opacity-20 animate-float blur-[1px]"
            style={{
              top: '10%',
              right: '10%',
              transform: `translateY(${scrollY * 0.2}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <img 
            src={engine2} 
            alt="" 
            className="absolute w-[450px] opacity-15 animate-float-slow blur-[1px]"
            style={{
              bottom: '15%',
              left: '5%',
              transform: `translateY(${scrollY * 0.15}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <img 
            src={engine3} 
            alt="" 
            className="absolute w-[400px] opacity-10 animate-float-slower blur-[1px]"
            style={{
              top: '40%',
              left: '50%',
              transform: `translate(-50%, ${scrollY * 0.25}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        </div>

        {/* Header Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Car className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
            Vehicle Lookup
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Decode any VIN or search by license plate
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Lookup Form */}
          <VehicleLookupForm onLookup={handleLookup} isLoading={isLoading} />

          {/* Results */}
          {vehicleData && <VehicleResults data={vehicleData} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Vehicle data provided by NHTSA vPIC API</p>
            <p className="mt-2">For demonstration purposes only</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

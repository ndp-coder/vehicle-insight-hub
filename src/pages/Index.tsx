import { useState } from "react";
import { VehicleLookupForm } from "@/components/VehicleLookupForm";
import { VehicleResults } from "@/components/VehicleResults";
import { Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Vehicle Lookup</h1>
              <p className="text-sm text-muted-foreground">Decode VIN or search by license plate</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Lookup Form */}
          <VehicleLookupForm onLookup={handleLookup} isLoading={isLoading} />

          {/* Results */}
          {vehicleData && <VehicleResults data={vehicleData} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
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

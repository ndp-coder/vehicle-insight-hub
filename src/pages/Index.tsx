import { useState, useEffect } from "react";
import { VehicleLookupForm } from "@/components/VehicleLookupForm";
import { VehicleResults } from "@/components/VehicleResults";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
      toast.success('Vehicle data retrieved successfully');

    } catch (error) {
      console.error('Lookup error:', error);
      toast.error('Failed to lookup vehicle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Apple-style Sticky Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 apple-blur-bg shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[980px] mx-auto px-6">
          <div className="h-[44px] flex items-center justify-between">
            <div className="text-[21px] font-semibold tracking-tight">
              Vehicle Intelligence
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-[88px] pb-[80px] px-6 overflow-hidden">
        <div className="max-w-[980px] mx-auto text-center">
          <div className="opacity-0 animate-fade-in-up">
            <h1 className="apple-text-hero mb-4">
              Vehicle Intelligence,<br />Reimagined.
            </h1>
          </div>
          <div className="opacity-0 animate-fade-in-up delay-200">
            <p className="apple-text-subheadline text-muted-foreground max-w-[600px] mx-auto">
              Decode any VIN or lookup license plates with precision and speed.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20 px-6">
        <div className="max-w-[692px] mx-auto opacity-0 animate-fade-in-up delay-300">
          <VehicleLookupForm onLookup={handleLookup} isLoading={isLoading} />
        </div>
      </section>

      {/* Results Section */}
      {vehicleData && (
        <section className="pb-32 px-6">
          <div className="max-w-[1200px] mx-auto">
            <VehicleResults data={vehicleData} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-[980px] mx-auto">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Vehicle data provided by NHTSA vPIC API
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              For demonstration purposes only
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

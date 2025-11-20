import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { VehicleData } from "@/pages/Index";

interface VehicleLookupFormProps {
  onLookup: (data: VehicleData) => void;
  isLoading: boolean;
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export const VehicleLookupForm = ({ onLookup, isLoading }: VehicleLookupFormProps) => {
  const [vin, setVin] = useState("");
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("");

  const validateVIN = (vin: string): boolean => {
    const cleanVin = vin.trim().toUpperCase();
    if (cleanVin.length !== 17) {
      toast.error("VIN must be exactly 17 characters");
      return false;
    }
    // Basic VIN validation (no I, O, Q characters)
    if (/[IOQ]/i.test(cleanVin)) {
      toast.error("VIN cannot contain the letters I, O, or Q");
      return false;
    }
    return true;
  };

  const handleVINSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVIN(vin)) return;
    onLookup({ vin: vin.trim().toUpperCase() });
  };

  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate.trim()) {
      toast.error("Please enter a license plate number");
      return;
    }
    
    if (!state) {
      toast.error("Please select a state");
      return;
    }

    onLookup({ 
      plate: {
        number: plate.trim().toUpperCase(),
        state,
        expiration: ""
      }
    });
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <Tabs defaultValue="vin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
          <TabsTrigger value="plate">License Plate</TabsTrigger>
        </TabsList>

        <TabsContent value="vin" className="p-6">
          <form onSubmit={handleVINSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="vin" className="text-base font-semibold">
                Vehicle Identification Number (VIN)
              </Label>
              <Input
                id="vin"
                placeholder="Enter 17-character VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                maxLength={17}
                className="h-12 text-lg"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                {vin.length}/17 characters
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              disabled={isLoading || vin.length !== 17}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Decoding VIN...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Decode VIN
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="plate" className="p-6">
          <form onSubmit={handlePlateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="plate" className="text-base font-semibold">
                License Plate Number
              </Label>
              <Input
                id="plate"
                placeholder="Enter plate number"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-base font-semibold">
                State
              </Label>
              <Select value={state} onValueChange={setState} disabled={isLoading}>
                <SelectTrigger id="state" className="h-12 text-base">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              disabled={isLoading || !plate || !state}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Looking up vehicle...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search Vehicle
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

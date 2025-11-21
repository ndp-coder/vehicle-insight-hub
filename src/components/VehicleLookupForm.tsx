import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
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
  const [mode, setMode] = useState<"vin" | "plate">("vin");
  const [vin, setVin] = useState("");
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("");

  const validateVIN = (vin: string): boolean => {
    const cleanVin = vin.trim().toUpperCase();
    if (cleanVin.length !== 17) {
      toast.error("VIN must be exactly 17 characters");
      return false;
    }
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
    <div className="bg-card rounded-[28px] overflow-hidden shadow-lg border border-border/50">
      {/* Mode Selector */}
      <div className="bg-muted/30 p-1 m-6 rounded-full flex gap-1">
        <button
          type="button"
          onClick={() => setMode("vin")}
          className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === "vin"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          disabled={isLoading}
        >
          VIN Lookup
        </button>
        <button
          type="button"
          onClick={() => setMode("plate")}
          className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === "plate"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          disabled={isLoading}
        >
          License Plate
        </button>
      </div>

      {mode === "vin" ? (
        <form onSubmit={handleVINSubmit} className="p-6 pt-0">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="vin" className="text-base font-medium">
                Vehicle Identification Number
              </Label>
              <Input
                id="vin"
                placeholder="Enter 17-character VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                maxLength={17}
                className="h-[52px] text-lg rounded-xl border-border/50 focus:border-accent focus:ring-accent/20 transition-all"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                {vin.length}/17 characters
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-[52px] text-base rounded-xl bg-accent hover:bg-accent/90 transition-all duration-200 font-medium"
              disabled={isLoading || vin.length !== 17}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Decoding...
                </>
              ) : (
                "Decode VIN"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePlateSubmit} className="p-6 pt-0">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="plate" className="text-base font-medium">
                License Plate Number
              </Label>
              <Input
                id="plate"
                placeholder="Enter plate number"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="h-[52px] text-lg rounded-xl border-border/50 focus:border-accent focus:ring-accent/20 transition-all"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="state" className="text-base font-medium">
                State
              </Label>
              <Select value={state} onValueChange={setState} disabled={isLoading}>
                <SelectTrigger id="state" className="h-[52px] text-base rounded-xl border-border/50">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s} className="rounded-lg">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-[52px] text-base rounded-xl bg-accent hover:bg-accent/90 transition-all duration-200 font-medium"
              disabled={isLoading || !plate || !state}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Looking up...
                </>
              ) : (
                "Search Vehicle"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

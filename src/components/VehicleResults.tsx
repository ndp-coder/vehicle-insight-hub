import { Badge } from "@/components/ui/badge";
import {
  Car,
  Calendar,
  Factory,
  Fuel,
  Settings,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { VehicleData } from "@/pages/Index";

interface VehicleResultsProps {
  data: VehicleData;
}

export const VehicleResults = ({ data }: VehicleResultsProps) => {
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div className="py-3 border-b border-border/30 last:border-0">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Card - Vehicle Name */}
      <div className="opacity-0 animate-fade-in-up">
        <div className="bg-card rounded-[28px] overflow-hidden shadow-lg border border-border/50 p-8 text-center">
          <div className="space-y-4">
            <h2 className="apple-text-headline">
              {data.year} {data.make} {data.model}
            </h2>
            <p className="apple-text-body text-muted-foreground">
              {data.manufacturer}
            </p>
            {data.vin && (
              <Badge variant="secondary" className="text-base px-6 py-2 font-mono rounded-full">
                VIN: {data.vin}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Specifications Card */}
        <div className="opacity-0 animate-fade-in-up delay-100">
          <div className="bg-card rounded-[28px] overflow-hidden shadow-lg border border-border/50 p-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-full bg-muted">
                <Settings className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Specifications</h3>
            </div>
            <div className="space-y-1">
              <InfoItem label="Vehicle Type" value={data.vehicleType || "N/A"} />
              <InfoItem label="Body Class" value={data.bodyClass || "N/A"} />
              <InfoItem label="Engine" value={data.engineConfiguration || "N/A"} />
              <InfoItem label="Cylinders" value={data.engineCylinders || "N/A"} />
              <InfoItem label="Displacement" value={data.displacement ? `${data.displacement}L` : "N/A"} />
              <InfoItem label="Fuel Type" value={data.fuelType || "N/A"} />
              <InfoItem label="Transmission" value={data.transmission || "N/A"} />
              <InfoItem label="Drive Type" value={data.driveType || "N/A"} />
              <InfoItem label="Doors" value={data.doors || "N/A"} />
            </div>
          </div>
        </div>

        {/* Manufacturing Card */}
        <div className="opacity-0 animate-fade-in-up delay-200">
          <div className="bg-card rounded-[28px] overflow-hidden shadow-lg border border-border/50 p-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-full bg-muted">
                <Factory className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Manufacturing</h3>
            </div>
            <div className="space-y-1">
              <InfoItem label="Model Year" value={data.year || "N/A"} />
              <InfoItem label="Plant City" value={data.plantCity || "N/A"} />
              <InfoItem label="Plant Country" value={data.plantCountry || "N/A"} />
            </div>

            {/* Vehicle History */}
            {data.history && (
              <div className="mt-8 pt-8 border-t border-border/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-full bg-muted">
                    <FileText className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Vehicle History</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
                    <span className="text-sm font-medium">Title Status</span>
                    <Badge
                      variant={data.history.title === "Clean" ? "default" : "destructive"}
                      className="flex items-center gap-1.5 rounded-full"
                    >
                      {data.history.title === "Clean" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5" />
                      )}
                      {data.history.title}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-2xl bg-muted/30">
                      <p className="text-2xl font-semibold text-foreground">{data.history.accidents}</p>
                      <p className="text-xs text-muted-foreground mt-1">Accidents</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-muted/30">
                      <p className="text-2xl font-semibold text-foreground">{data.history.owners}</p>
                      <p className="text-xs text-muted-foreground mt-1">Owners</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Service Records</p>
                    <p className="text-sm font-medium">{data.history.service}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Plate Info */}
            {data.plate && (
              <div className="mt-8 pt-8 border-t border-border/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-full bg-muted">
                    <CreditCard className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Registration</h3>
                </div>
                <div className="space-y-1">
                  <InfoItem label="Plate Number" value={data.plate.number} />
                  <InfoItem label="State" value={data.plate.state} />
                  <InfoItem label="Expiration" value={data.plate.expiration} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

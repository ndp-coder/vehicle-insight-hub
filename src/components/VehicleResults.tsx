import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Main Vehicle Info */}
      <Card className="shadow-[var(--shadow-elevated)] border-border/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl font-bold">
                {data.year} {data.make} {data.model}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {data.manufacturer}
              </p>
            </div>
            {data.vin && (
              <Badge variant="secondary" className="text-base px-4 py-2 font-mono">
                VIN: {data.vin}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vehicle Specifications */}
        <Card className="shadow-[var(--shadow-card)] border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoItem icon={Car} label="Vehicle Type" value={data.vehicleType || "N/A"} />
            <InfoItem icon={Car} label="Body Class" value={data.bodyClass || "N/A"} />
            <Separator className="my-2" />
            <InfoItem icon={Settings} label="Engine Configuration" value={data.engineConfiguration || "N/A"} />
            <InfoItem icon={Settings} label="Cylinders" value={data.engineCylinders || "N/A"} />
            <InfoItem icon={Fuel} label="Displacement" value={data.displacement ? `${data.displacement}L` : "N/A"} />
            <InfoItem icon={Fuel} label="Fuel Type" value={data.fuelType || "N/A"} />
            <Separator className="my-2" />
            <InfoItem icon={Settings} label="Transmission" value={data.transmission || "N/A"} />
            <InfoItem icon={Car} label="Drive Type" value={data.driveType || "N/A"} />
            <InfoItem icon={Car} label="Doors" value={data.doors || "N/A"} />
          </CardContent>
        </Card>

        {/* Manufacturing & History */}
        <div className="space-y-6">
          {/* Manufacturing */}
          <Card className="shadow-[var(--shadow-card)] border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Manufacturing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <InfoItem icon={Calendar} label="Model Year" value={data.year || "N/A"} />
              <InfoItem icon={Factory} label="Plant City" value={data.plantCity || "N/A"} />
              <InfoItem icon={Factory} label="Plant Country" value={data.plantCountry || "N/A"} />
            </CardContent>
          </Card>

          {/* Vehicle History */}
          {data.history && (
            <Card className="shadow-[var(--shadow-card)] border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Vehicle History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Title Status</span>
                  <Badge 
                    variant={data.history.title === "Clean" ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {data.history.title === "Clean" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {data.history.title}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{data.history.accidents}</p>
                    <p className="text-xs text-muted-foreground">Accidents</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{data.history.owners}</p>
                    <p className="text-xs text-muted-foreground">Owners</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Service Records</p>
                  <p className="text-sm font-medium">{data.history.service}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plate Info */}
          {data.plate && (
            <Card className="shadow-[var(--shadow-card)] border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoItem icon={CreditCard} label="Plate Number" value={data.plate.number} />
                <InfoItem icon={Factory} label="State" value={data.plate.state} />
                <InfoItem icon={Calendar} label="Expiration" value={data.plate.expiration} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

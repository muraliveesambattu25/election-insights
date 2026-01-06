import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "electors" | "polling" | "margin" | "nota";
}

const variantStyles = {
  default: "border-border",
  electors: "border-l-4 border-l-kpi-electors",
  polling: "border-l-4 border-l-kpi-polling",
  margin: "border-l-4 border-l-kpi-margin",
  nota: "border-l-4 border-l-kpi-nota",
};

const iconVariantStyles = {
  default: "bg-secondary text-secondary-foreground",
  electors: "bg-kpi-electors/10 text-kpi-electors",
  polling: "bg-kpi-polling/10 text-kpi-polling",
  margin: "bg-kpi-margin/10 text-kpi-margin",
  nota: "bg-kpi-nota/10 text-kpi-nota",
};

export function KPICard({ title, value, subtitle, icon: Icon, variant = "default" }: KPICardProps) {
  return (
    <div className={cn("kpi-card animate-fade-in", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconVariantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

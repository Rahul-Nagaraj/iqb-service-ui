import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: "primary" | "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  "chart-1": "bg-chart-1/10 text-chart-1",
  "chart-2": "bg-chart-2/10 text-chart-2",
  "chart-3": "bg-chart-3/10 text-chart-3",
  "chart-4": "bg-chart-4/10 text-chart-4",
  "chart-5": "bg-chart-5/10 text-chart-5",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "primary",
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start gap-4 p-6">
        <div className={`rounded-lg p-3 ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          {hint && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

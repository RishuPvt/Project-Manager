import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utilis"

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "primary" | "secondary" | "accent" | "default";
}

export function FeatureCard({ icon: Icon, title, description, color = "default" }: FeatureCardProps) {
  const colorVariants = {
    primary: "bg-primary/10 text-primary hover:bg-primary/15",
    secondary: "bg-secondary/10 text-secondary hover:bg-secondary/15",
    accent: "bg-accent/10 text-accent hover:bg-accent/15",
    default: "bg-muted hover:bg-muted/70"
  };

  return (
    <div className={cn(
      "flex flex-col items-center p-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border",
      colorVariants[color]
    )}>
      <div className="p-3 rounded-full mb-4 bg-background shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}

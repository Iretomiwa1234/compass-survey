import React from "react";
import { SearchX, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "search" | "clipboard" | React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = "Nothing to see here",
  description = "It seems we couldn't find what you're looking for.",
  icon = "clipboard",
  action,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (icon === "search") {
      return (
        <div className="relative mb-4">
          <div className="absolute -inset-1 rounded-full bg-blue-50 animate-pulse" />
          <SearchX className="relative h-12 w-12 text-blue-500" />
        </div>
      );
    }
    if (icon === "clipboard") {
      return (
        <div className="relative mb-4">
          <div className="absolute -inset-1 rounded-full bg-slate-50 animate-pulse" />
          <ClipboardList className="relative h-12 w-12 text-slate-400" />
        </div>
      );
    }
    return icon;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border-2 border-dashed border-slate-100 bg-white/50 transition-all">
      {renderIcon()}
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-[250px] mb-6">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-colors gap-2"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InputTypeButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  className?: string;
}

const InputTypeButton = ({
  icon: Icon,
  label,
  onClick,
  onDragStart,
  className,
}: InputTypeButtonProps) => {
  return (
    <Button
      variant="outline"
      draggable={true}
      onDragStart={onDragStart}
      className={cn(
        "w-full justify-start gap-2 h-auto py-2.5 px-3 text-xs font-normal bg-card hover:bg-accent hover:text-accent-foreground border-border",
        className
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
};

export default InputTypeButton;

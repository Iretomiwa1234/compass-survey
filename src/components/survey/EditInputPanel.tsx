import { Card } from "@/components/ui/card";

const EditInputPanel = () => {
  return (
    <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto h-[calc(100vh-var(--nav-height))]">
      <h2 className="text-lg font-semibold mb-4">Edit Input</h2>
      
      <Card className="p-4 bg-muted/50 border-0">
        <p className="text-sm text-muted-foreground text-center">
          Click on input to start editing
        </p>
      </Card>
    </div>
  );
};

export default EditInputPanel;


import { Card } from "@/components/ui/card";

const EditInputPanel = () => {
  return (
    <div className="min-w-[300px] max-w-[350px] rounded-lg bg-card p-4 overflow-y-auto h-[calc(100vh-var(--nav-height))] w-[35%]">
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

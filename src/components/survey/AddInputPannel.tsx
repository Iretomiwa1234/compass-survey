import InputTypeButton from "./InputTypeButton";
import {
  Type,
  Hash,
  Calendar,
  Clock,
  Mail,
  Globe,
  ChevronDown,
  BarChart,
  Grid3x3,
  CheckSquare,
  TrendingUp,
  Star,
  List,
  MapPin,
  Map,
  ListOrdered
} from "lucide-react";

const AddInputPanel = () => {
  return (
    <div className="w-80 border-r border-border bg-card p-4 overflow-y-auto h-[calc(100vh-var(--nav-height))]">
      <h2 className="text-lg font-semibold mb-4">Add Input</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            Text, Number, Date and Time
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <InputTypeButton icon={Type} label="Single line text" />
            <InputTypeButton icon={Clock} label="Time" />
            <InputTypeButton icon={List} label="Multiline text" />
            <InputTypeButton icon={Calendar} label="Date and Time" />
            <InputTypeButton icon={Hash} label="Number" />
            <InputTypeButton icon={Mail} label="Email" />
            <InputTypeButton icon={TrendingUp} label="Slider" />
            <InputTypeButton icon={Globe} label="Website" />
            <InputTypeButton icon={Calendar} label="Date" />
            <InputTypeButton icon={Grid3x3} label="Barcode" />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            Choice
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <InputTypeButton icon={CheckSquare} label="Single Select" />
            <InputTypeButton icon={Grid3x3} label="Single Select Grid" />
            <InputTypeButton icon={CheckSquare} label="Multiple Select" />
            <InputTypeButton icon={BarChart} label="Likert Scale" />
            <InputTypeButton icon={ListOrdered} label="Ranking" />
            <InputTypeButton icon={Star} label="Rating" />
            <InputTypeButton icon={ChevronDown} label="Drop down" />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            Location
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <InputTypeButton icon={Map} label="Map" />
            <InputTypeButton icon={MapPin} label="Address" />
            <InputTypeButton icon={List} label="Location List" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInputPanel;

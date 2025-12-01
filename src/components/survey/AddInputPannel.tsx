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
  ListOrdered,
} from "lucide-react";

interface AddInputPanelProps {
  onSelect?: (label: string) => void;
}

const AddInputPanel = ({ onSelect }: AddInputPanelProps) => {
  return (
    <div className="min-w-[300px] bg-card p-4 overflow-y-auto h-[calc(100vh-var(--nav-height))] rounded-lg md:w-[30%] w-full">
      <h2 className="text-lg font-semibold mb-4">Add Input</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            Text, Number, Date and Time
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <InputTypeButton
              icon={Type}
              label="Single line text"
              onClick={() => onSelect?.("Question")}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/x-inputtype",
                  "Single line text"
                )
              }
            />
            <InputTypeButton
              icon={Clock}
              label="Time"
              onClick={() => onSelect?.("Time")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Time")
              }
            />
            <InputTypeButton
              icon={List}
              label="Multiline text"
              onClick={() => onSelect?.("Multiline text")}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/x-inputtype",
                  "Multiline text"
                )
              }
            />
            <InputTypeButton
              icon={Calendar}
              label="Date and Time"
              onClick={() => onSelect?.("Date and Time")}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/x-inputtype",
                  "Date and Time"
                )
              }
            />
            <InputTypeButton
              icon={Hash}
              label="Number"
              onClick={() => onSelect?.("Number")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Number")
              }
            />
            <InputTypeButton
              icon={Mail}
              label="Email"
              onClick={() => onSelect?.("Email")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Email")
              }
            />
            <InputTypeButton
              icon={TrendingUp}
              label="Slider"
              onClick={() => onSelect?.("Slider")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Slider")
              }
            />
            <InputTypeButton
              icon={Globe}
              label="Website"
              onClick={() => onSelect?.("Website")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Website")
              }
            />
            <InputTypeButton
              icon={Calendar}
              label="Date"
              onClick={() => onSelect?.("Date")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Date")
              }
            />
            <InputTypeButton
              icon={Grid3x3}
              label="Barcode"
              onClick={() => onSelect?.("Barcode")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Barcode")
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            Choice
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <InputTypeButton
              icon={CheckSquare}
              label="Single Select"
              onClick={() => onSelect?.("Single Select")}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/x-inputtype",
                  "Single Select"
                )
              }
            />
            <InputTypeButton
              icon={Grid3x3}
              label="Single Select Grid"
              onClick={() => onSelect?.("Single Select Grid")}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/x-inputtype",
                  "Single Select Grid"
                )
              }
            />
            <InputTypeButton
              icon={CheckSquare}
              label="Multiple Select"
              onClick={() => onSelect?.("Multiple Select")}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/x-inputtype",
                  "Multiple Select"
                )
              }
            />
            <InputTypeButton
              icon={BarChart}
              label="Likert Scale"
              onClick={() => onSelect?.("Likert Scale")}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/x-inputtype",
                  "Likert Scale"
                )
              }
            />
            <InputTypeButton
              icon={ListOrdered}
              label="Ranking"
              onClick={() => onSelect?.("Ranking")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Ranking")
              }
            />
            <InputTypeButton
              icon={Star}
              label="Rating"
              onClick={() => onSelect?.("Rating")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Rating")
              }
            />
            <InputTypeButton
              icon={ChevronDown}
              label="Drop down"
              onClick={() => onSelect?.("Drop down")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Drop down")
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-3">
            Location
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <InputTypeButton
              icon={Map}
              label="Map"
              onClick={() => onSelect?.("Map")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Map")
              }
            />
            <InputTypeButton
              icon={MapPin}
              label="Address"
              onClick={() => onSelect?.("Address")}
              onDragStart={(e) =>
                e.dataTransfer.setData("application/x-inputtype", "Address")
              }
            />
            <InputTypeButton
              icon={List}
              label="Location List"
              onClick={() => onSelect?.("Location List")}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/x-inputtype",
                  "Location List"
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInputPanel;

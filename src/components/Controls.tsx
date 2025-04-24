
import { Button } from "@/components/ui/button";
import { Save, Upload, Trash2, Download } from "lucide-react";

interface ControlsProps {
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onExport: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onSave, onLoad, onClear, onExport }) => {
  return (
    <div className="controls">
      <div className="flex flex-wrap gap-2">
        <Button onClick={onSave} className="flex items-center gap-1">
          <Save className="h-4 w-4" /> Save
        </Button>
        <Button onClick={onLoad} className="flex items-center gap-1">
          <Upload className="h-4 w-4" /> Load
        </Button>
        <Button onClick={onClear} variant="destructive" className="flex items-center gap-1">
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
        <Button onClick={onExport} variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
};

export default Controls;

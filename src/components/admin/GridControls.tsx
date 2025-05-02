
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GridStyleState } from "@/hooks/use-admin-grid";

interface GridControlsProps {
  gridStyle: GridStyleState;
  onStyleChange: (newStyle: GridStyleState) => void;
  onReset: () => void;
}

const GridControls = ({ gridStyle, onStyleChange, onReset }: GridControlsProps) => {
  return (
    <div className="admin-controls">
      <h2 className="text-xl font-bold mb-4">Map Controls</h2>
      
      <div className="control-group">
        <Label>Width: {gridStyle.width}%</Label>
        <Slider 
          value={[gridStyle.width]} 
          min={40} 
          max={95} 
          step={1}
          onValueChange={(vals) => onStyleChange({ ...gridStyle, width: vals[0] })}
        />
      </div>
      
      <div className="control-group">
        <Label>Perspective: {gridStyle.perspective}px</Label>
        <Slider 
          value={[gridStyle.perspective]} 
          min={500} 
          max={4000} 
          step={50}
          onValueChange={(vals) => onStyleChange({ ...gridStyle, perspective: vals[0] })}
        />
      </div>

      <div className="control-group">
        <Label>Orientation: {gridStyle.orientation}°</Label>
        <Slider 
          value={[gridStyle.orientation]} 
          min={-180} 
          max={180} 
          step={5}
          onValueChange={(vals) => onStyleChange({ ...gridStyle, orientation: vals[0] })}
        />
      </div>
      
      <Button onClick={onReset} variant="outline" size="sm" className="mt-4">
        Reset to Default
      </Button>
    </div>
  );
};

export default GridControls;

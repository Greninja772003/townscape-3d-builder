
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
      <h2 className="text-xl font-bold mb-4">Grid Controls</h2>
      
      <div className="control-group">
        <Label>Rotation: {gridStyle.rotation}°</Label>
        <Slider 
          value={[gridStyle.rotation]} 
          min={0} 
          max={60} 
          step={1}
          onValueChange={(vals) => onStyleChange({ ...gridStyle, rotation: vals[0] })}
        />
      </div>
      
      <div className="control-group">
        <Label>Scale: {gridStyle.scale.toFixed(1)}</Label>
        <Slider 
          value={[gridStyle.scale]} 
          min={0.5} 
          max={2} 
          step={0.1}
          onValueChange={(vals) => onStyleChange({ ...gridStyle, scale: vals[0] })}
        />
      </div>
      
      <div className="control-group">
        <Label>Perspective: {gridStyle.perspective}px</Label>
        <Slider 
          value={[gridStyle.perspective]} 
          min={500} 
          max={2000} 
          step={50}
          onValueChange={(vals) => onStyleChange({ ...gridStyle, perspective: vals[0] })}
        />
      </div>
      
      <div className="control-group">
        <Label>Vertical Position: {gridStyle.marginBottom}%</Label>
        <Slider 
          value={[gridStyle.marginBottom]} 
          min={0} 
          max={30} 
          step={1}
          onValueChange={(vals) => onStyleChange({ ...gridStyle, marginBottom: vals[0] })}
        />
      </div>

      <div className="control-group">
        <Label>Horizontal Position: {gridStyle.horizontalPosition}%</Label>
        <Slider 
          value={[gridStyle.horizontalPosition]} 
          min={0} 
          max={100} 
          step={1}
          onValueChange={(vals) => onStyleChange({ ...gridStyle, horizontalPosition: vals[0] })}
        />
      </div>
      
      <Button onClick={onReset} variant="outline" size="sm" className="mt-4">
        Reset to Default
      </Button>
    </div>
  );
};

export default GridControls;


import { Building } from "@/types/building";
import DraggableBuilding from "./DraggableBuilding";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import BuildingContextMenu from "./BuildingContextMenu";

interface BuildingCanvasProps {
  buildings: { [key: string]: Building };
  gridStyle: {
    perspective: number;
    width: number;
    orientation: number;
  };
  isEditable?: boolean;
  onPositionChange?: (id: string, position: Partial<{ x: number, y: number, rotation: number }>) => void;
  onScaleChange?: (id: string, scale: number) => void;
  onBuildingSelect?: (id: string) => void;
  selectedBuildingId?: string | null;
  onAddBuilding?: (x: number, y: number) => void;
  onRemoveSelected?: () => void;
}

const BuildingCanvas: React.FC<BuildingCanvasProps> = ({ 
  buildings, 
  gridStyle,
  isEditable = false,
  onPositionChange,
  onScaleChange,
  onBuildingSelect,
  selectedBuildingId,
  onAddBuilding,
  onRemoveSelected
}) => {
  const isMobile = useIsMobile();
  const [showMobileIndicator, setShowMobileIndicator] = useState(false);

  useEffect(() => {
    if (isMobile) {
      const timeout = setTimeout(() => {
        setShowMobileIndicator(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isMobile]);

  const canvasStyle = {
    width: `${gridStyle.width}%`,
    transform: `perspective(${gridStyle.perspective}px) rotateZ(${gridStyle.orientation}deg)`,
  };

  const handleAddBuilding = (x: number, y: number) => {
    if (isEditable && onAddBuilding) {
      console.log("Adding building at:", x, y);
      onAddBuilding(x, y);
    }
  };

  const handleRemoveSelected = () => {
    if (isEditable && onRemoveSelected && selectedBuildingId) {
      console.log("Removing selected building:", selectedBuildingId);
      onRemoveSelected();
    }
  };

  return (
    <BuildingContextMenu 
      onAdd={handleAddBuilding}
      onRemove={handleRemoveSelected}
      showRemoveOption={!!selectedBuildingId}
      isEditable={isEditable}
    >
      <div 
        className="building-canvas"
        style={canvasStyle}
      >
        {Object.values(buildings).map((building) => (
          <DraggableBuilding
            key={building.id}
            building={building}
            isEditable={isEditable}
            onPositionChange={onPositionChange}
            onScaleChange={onScaleChange}
            onSelect={onBuildingSelect}
            isSelected={selectedBuildingId === building.id}
          />
        ))}
        {isMobile && showMobileIndicator && isEditable && (
          <div className="mobile-edit-indicator">
            <p>Use two fingers to pinch and scale buildings</p>
          </div>
        )}
      </div>
    </BuildingContextMenu>
  );
};

export default BuildingCanvas;

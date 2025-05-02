
import { Building } from "@/types/building";
import DraggableBuilding from "./DraggableBuilding";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

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
}

const BuildingCanvas: React.FC<BuildingCanvasProps> = ({ 
  buildings, 
  gridStyle,
  isEditable = false,
  onPositionChange,
  onScaleChange,
  onBuildingSelect,
  selectedBuildingId
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

  return (
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
  );
};

export default BuildingCanvas;

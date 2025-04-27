import { useState, useEffect } from "react";
import { toast } from "sonner";
import GridCell from "@/components/GridCell";
import BuildingModal from "@/components/BuildingModal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { logoutUser, STORAGE_KEYS } from "@/utils/buildingData";
import { useNavigate } from "react-router-dom";

// Constants
const ROWS = 4;
const COLS = 7;
const DEFAULT_ROTATION = 30;
const DEFAULT_SCALE = 1.2;

// Merged cells configuration
const MERGED_CELLS = [
  { primary: 18, secondary: 19 }
];

export interface Building {
  imageUrl: string;
  cellId: number;
  name: string;
  scale: number;
  fileName?: string | null;
  redirectUrl?: string;
}

type BuildingsState = {
  [key: string]: Building;
};

type GridStyleState = {
  rotation: number;
  scale: number;
  marginBottom: number;
  perspective: number;
};

const DEFAULT_GRID_STYLE: GridStyleState = {
  rotation: DEFAULT_ROTATION,
  scale: DEFAULT_SCALE,
  marginBottom: 10,
  perspective: 1000,
};

const AdminPortal = () => {
  const [buildings, setBuildings] = useState<BuildingsState>({});
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gridStyle, setGridStyle] = useState<GridStyleState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRID_STYLE);
    return saved ? JSON.parse(saved) : DEFAULT_GRID_STYLE;
  });
  
  const navigate = useNavigate();

  // Create grid cells array with merged cell handling
  const gridCells = Array.from({ length: ROWS * COLS }, (_, i) => {
    const cellId = i + 1;
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    
    // Check if this cell should be skipped (secondary part of a merged cell)
    const isSecondary = MERGED_CELLS.some(merge => merge.secondary === cellId);
    if (isSecondary) return null;
    
    // Check if this cell is the primary part of a merged cell
    const isMerged = MERGED_CELLS.some(merge => merge.primary === cellId);
    
    return { cellId, row, col, isMerged };
  }).filter(Boolean); // Filter out null entries

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    toast.success("Logged out successfully!");
  };

  const handleCellClick = (cellId: number) => {
    setSelectedCell(cellId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const placeNewBuilding = (
    imageUrl: string,
    cellId: number,
    name: string,
    scale: number = 1,
    fileName: string | null = null,
    redirectUrl?: string
  ) => {
    const newBuilding = {
      imageUrl,
      cellId,
      name,
      scale,
      fileName,
      redirectUrl,
    };

    setBuildings((prev) => {
      const updated = { ...prev };
      updated[`cell-${cellId}`] = newBuilding;
      
      // If this is a merged cell, apply the building to both cells
      const mergedCell = MERGED_CELLS.find(m => m.primary === cellId);
      if (mergedCell) {
        updated[`cell-${mergedCell.secondary}`] = { ...newBuilding, cellId: mergedCell.secondary };
      }
      
      return updated;
    });
  };

  const removeBuilding = (cellId: number) => {
    setBuildings((prev) => {
      const updated = { ...prev };
      delete updated[`cell-${cellId}`];
      
      // If this is a merged cell, remove the building from both cells
      const mergedCell = MERGED_CELLS.find(m => m.primary === cellId);
      if (mergedCell) {
        delete updated[`cell-${mergedCell.secondary}`];
      }
      
      return updated;
    });
    
    toast.success("Building removed successfully!");
  };

  // Load saved state on component mount
  useEffect(() => {
    loadGridState();
  }, []);

  // Save to localStorage when buildings change
  useEffect(() => {
    if (Object.keys(buildings).length > 0) {
      localStorage.setItem(STORAGE_KEYS.GRID_DATA, JSON.stringify(buildings));
    }
  }, [buildings]);

  // Save grid style when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRID_STYLE, JSON.stringify(gridStyle));
  }, [gridStyle]);

  const saveGridState = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.GRID_DATA, JSON.stringify(buildings));
      localStorage.setItem(STORAGE_KEYS.GRID_STYLE, JSON.stringify(gridStyle));
      toast.success("Layout saved successfully!");
    } catch (e) {
      console.error("Failed to save grid state:", e);
      toast.error("Failed to save layout");
    }
  };

  const loadGridState = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEYS.GRID_DATA);
      const savedStyle = localStorage.getItem(STORAGE_KEYS.GRID_STYLE);
      
      if (savedState) {
        setBuildings(JSON.parse(savedState));
      }
      
      if (savedStyle) {
        setGridStyle(JSON.parse(savedStyle));
      }
    } catch (e) {
      console.error("Failed to load grid state:", e);
      toast.error("Failed to load layout");
    }
  };

  const resetGridStyle = () => {
    setGridStyle(DEFAULT_GRID_STYLE);
    toast.success("Grid style reset to defaults");
  };

  const gridTransformStyles = {
    transform: `perspective(${gridStyle.perspective}px) rotateX(${gridStyle.rotation}deg) scale(${gridStyle.scale})`,
    marginBottom: `calc(${gridStyle.marginBottom}% - 15px)`,
  };

  return (
    <div className="world-container">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <Button onClick={saveGridState} variant="secondary">Save Layout</Button>
        <Button onClick={handleLogout} variant="outline">Return to View Mode</Button>
      </div>

      <div className="admin-controls">
        <h2 className="text-xl font-bold mb-4">Grid Controls</h2>
        
        <div className="control-group">
          <Label>Rotation: {gridStyle.rotation}°</Label>
          <Slider 
            value={[gridStyle.rotation]} 
            min={0} 
            max={60} 
            step={1}
            onValueChange={(vals) => setGridStyle(prev => ({...prev, rotation: vals[0]}))}
          />
        </div>
        
        <div className="control-group">
          <Label>Scale: {gridStyle.scale.toFixed(1)}</Label>
          <Slider 
            value={[gridStyle.scale]} 
            min={0.5} 
            max={2} 
            step={0.1}
            onValueChange={(vals) => setGridStyle(prev => ({...prev, scale: vals[0]}))}
          />
        </div>
        
        <div className="control-group">
          <Label>Perspective: {gridStyle.perspective}px</Label>
          <Slider 
            value={[gridStyle.perspective]} 
            min={500} 
            max={2000} 
            step={50}
            onValueChange={(vals) => setGridStyle(prev => ({...prev, perspective: vals[0]}))}
          />
        </div>
        
        <div className="control-group">
          <Label>Vertical Position: {gridStyle.marginBottom}%</Label>
          <Slider 
            value={[gridStyle.marginBottom]} 
            min={0} 
            max={30} 
            step={1}
            onValueChange={(vals) => setGridStyle(prev => ({...prev, marginBottom: vals[0]}))}
          />
        </div>
        
        <Button onClick={resetGridStyle} variant="outline" size="sm" className="mt-4">Reset to Default</Button>
      </div>

      <div 
        className="parent" 
        id="grid-container"
        style={gridTransformStyles}
      >
        {gridCells.map((cell) => (
          <GridCell
            key={cell.cellId}
            cellId={cell.cellId}
            row={cell.row}
            col={cell.col}
            onClick={handleCellClick}
            building={buildings[`cell-${cell.cellId}`]}
            fixedRotation={gridStyle.rotation}
            isEditable={true}
            isMerged={cell.isMerged}
          />
        ))}
      </div>

      {isModalOpen && selectedCell && (
        <BuildingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedCell={selectedCell}
          onAddBuilding={placeNewBuilding}
          onRemoveBuilding={() => removeBuilding(selectedCell)}
          hasExistingBuilding={!!buildings[`cell-${selectedCell}`]}
        />
      )}
    </div>
  );
};

export default AdminPortal;

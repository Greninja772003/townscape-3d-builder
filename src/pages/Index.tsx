
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GridCell from "@/components/GridCell";
import BuildingModal from "@/components/BuildingModal";
import Controls from "@/components/Controls";

// Constants
const ROWS = 4;
const COLS = 7;
const FIXED_ROTATION = 30;

export interface Building {
  imageUrl: string;
  cellId: number;
  name: string;
  scale: number;
  fileName?: string | null;
}

type BuildingsState = {
  [key: string]: Building;
};

const Index = () => {
  const [buildings, setBuildings] = useState<BuildingsState>({});
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create grid cells array
  const gridCells = Array.from({ length: ROWS * COLS }, (_, i) => {
    const cellId = i + 1;
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    return { cellId, row, col };
  });

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
    fileName: string | null = null
  ) => {
    const newBuilding = {
      imageUrl,
      cellId,
      name,
      scale,
      fileName,
    };

    setBuildings((prev) => {
      const updated = { ...prev };
      updated[`cell-${cellId}`] = newBuilding;
      return updated;
    });
  };

  const saveGridState = () => {
    try {
      localStorage.setItem("townGridBuildings", JSON.stringify(buildings));
      toast.success("Layout saved successfully!");
    } catch (e) {
      console.error("Failed to save grid state:", e);
      toast.error("Failed to save layout");
    }
  };

  const loadGridState = () => {
    try {
      const savedState = localStorage.getItem("townGridBuildings");
      if (savedState) {
        const savedBuildings = JSON.parse(savedState);
        
        // Filter out buildings with blob URLs as they won't persist between sessions
        const persistableBuildings: BuildingsState = {};
        Object.entries(savedBuildings).forEach(([key, building]) => {
          const typedBuilding = building as Building;
          if (!typedBuilding.imageUrl.startsWith("blob:")) {
            persistableBuildings[key] = typedBuilding;
          }
        });

        setBuildings(persistableBuildings);
        toast.success("Layout loaded successfully!");
      }
    } catch (e) {
      console.error("Failed to load grid state:", e);
      toast.error("Failed to load layout");
    }
  };

  const clearGrid = () => {
    if (confirm("Are you sure you want to clear all buildings from the grid?")) {
      setBuildings({});
      toast.success("Grid cleared successfully!");
    }
  };

  const exportGridData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(buildings));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "town_grid_layout.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Layout exported as JSON!");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "e") {
        event.preventDefault();
        exportGridData();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [buildings]);

  // Load saved state on component mount
  useEffect(() => {
    loadGridState();
  }, []);

  // Save to localStorage when buildings change
  useEffect(() => {
    if (Object.keys(buildings).length > 0) {
      localStorage.setItem("townGridBuildings", JSON.stringify(buildings));
    }
  }, [buildings]);

  return (
    <div className="world-container">
      <div className="parent" id="grid-container">
        {gridCells.map((cell) => (
          <GridCell
            key={cell.cellId}
            cellId={cell.cellId}
            row={cell.row}
            col={cell.col}
            onClick={handleCellClick}
            building={buildings[`cell-${cell.cellId}`]}
            fixedRotation={FIXED_ROTATION}
          />
        ))}
      </div>

      <Controls
        onSave={saveGridState}
        onLoad={loadGridState}
        onClear={clearGrid}
        onExport={exportGridData}
      />

      {isModalOpen && (
        <BuildingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedCell={selectedCell}
          onAddBuilding={placeNewBuilding}
        />
      )}
    </div>
  );
};

export default Index;

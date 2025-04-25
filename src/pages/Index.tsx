
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GridCell from "@/components/GridCell";
import BuildingModal from "@/components/BuildingModal";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logoutUser, STORAGE_KEYS } from "@/utils/buildingData";

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Create grid cells array
  const gridCells = Array.from({ length: ROWS * COLS }, (_, i) => {
    const cellId = i + 1;
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    return { cellId, row, col };
  });

  // Check if user is authenticated when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = () => {
    setIsAdmin(isAuthenticated());
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logoutUser();
    setIsAdmin(false);
    toast.success("Logged out successfully!");
  };

  const handleCellClick = (cellId: number) => {
    if (!isAdmin) {
      toast.error("You must be an administrator to modify the grid!");
      return;
    }
    
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

  const removeBuilding = (cellId: number) => {
    if (!isAdmin) return;
    
    setBuildings((prev) => {
      const updated = { ...prev };
      delete updated[`cell-${cellId}`];
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

  const saveGridState = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.GRID_DATA, JSON.stringify(buildings));
      toast.success("Layout saved successfully!");
    } catch (e) {
      console.error("Failed to save grid state:", e);
      toast.error("Failed to save layout");
    }
  };

  const loadGridState = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEYS.GRID_DATA);
      if (savedState) {
        setBuildings(JSON.parse(savedState));
      }
    } catch (e) {
      console.error("Failed to load grid state:", e);
      toast.error("Failed to load layout");
    }
  };

  return (
    <div className="world-container">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        {isAdmin ? (
          <>
            <Button onClick={saveGridState} variant="secondary">Save Layout</Button>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </>
        ) : (
          <Button onClick={handleLoginClick}>Admin Login</Button>
        )}
      </div>

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
            isEditable={isAdmin}
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

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          setIsAdmin(true);
        }}
      />
    </div>
  );
};

export default Index;

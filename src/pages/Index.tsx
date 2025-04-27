
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GridCell from "@/components/GridCell";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logoutUser, STORAGE_KEYS } from "@/utils/buildingData";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCw } from "lucide-react";

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
};

const DEFAULT_GRID_STYLE: GridStyleState = {
  rotation: DEFAULT_ROTATION,
  scale: DEFAULT_SCALE,
  marginBottom: 10,
};

const Index = () => {
  const [buildings, setBuildings] = useState<BuildingsState>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [gridStyle, setGridStyle] = useState<GridStyleState>(DEFAULT_GRID_STYLE);
  const [showRotateAlert, setShowRotateAlert] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Check for mobile orientation on mount and orientation change
  useEffect(() => {
    if (isMobile) {
      const checkOrientation = () => {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        setShowRotateAlert(isPortrait);
      };
      
      checkOrientation();
      
      window.addEventListener("resize", checkOrientation);
      return () => window.removeEventListener("resize", checkOrientation);
    } else {
      setShowRotateAlert(false);
    }
  }, [isMobile]);

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

  // Load saved state on component mount
  useEffect(() => {
    loadGridState();
  }, []);

  // Check authentication status
  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAdminAccess = () => {
    navigate('/admin-portal');
  };

  const handleCellClick = (cellId: number) => {
    // Non-editable in view mode, do nothing
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

  const gridTransformStyles = {
    transform: `rotateX(${gridStyle.rotation}deg) scale(${gridStyle.scale})`,
    marginBottom: `calc(${gridStyle.marginBottom}% - 15px)`,
  };

  return (
    <div className="world-container">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        {isAuthenticated() ? (
          <Button onClick={handleAdminAccess} variant="secondary">Edit Layout</Button>
        ) : (
          <Button onClick={handleLoginClick}>Admin Login</Button>
        )}
      </div>

      {showRotateAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-5/6 max-w-sm">
          <Alert className="bg-white/90 border-amber-500">
            <RotateCw className="h-4 w-4 text-amber-500 mr-2" />
            <AlertDescription>
              For the best experience, please rotate your device to landscape mode.
            </AlertDescription>
          </Alert>
        </div>
      )}

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
            isEditable={false}
            isMerged={cell.isMerged}
          />
        ))}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAdminAccess}
      />
    </div>
  );
};

export default Index;

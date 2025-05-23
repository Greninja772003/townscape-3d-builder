
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BuildingModal from "@/components/BuildingModal";
import GridControls from "@/components/admin/GridControls";
import BuildingCanvas from "@/components/BuildingCanvas";
import { useAdminGrid } from "@/hooks/use-admin-grid";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileRotateAlert from "@/components/MobileRotateAlert";

const AdminPortal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const [showRotateAlert, setShowRotateAlert] = useState(false);
  const [newBuildingPos, setNewBuildingPos] = useState<{x: number, y: number} | null>(null);
  
  const {
    buildings,
    gridStyle,
    setGridStyle,
    saveGridState,
    resetGridStyle,
    placeNewBuilding,
    updateBuildingPosition,
    updateBuildingScale,
    removeBuilding,
    selectedBuildingId,
    setSelectedBuildingId
  } = useAdminGrid();

  // Check for mobile portrait orientation
  useEffect(() => {
    if (isMobile) {
      const checkOrientation = () => {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        setShowRotateAlert(isPortrait);
      };
      
      checkOrientation();
      
      window.addEventListener("resize", checkOrientation);
      return () => window.removeEventListener("resize", checkOrientation);
    }
  }, [isMobile]);

  const handleLogout = () => {
    window.location.href = '/';
    toast.success("Returned to view mode!");
  };

  const handleAddBuilding = () => {
    setNewBuildingPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setIsModalOpen(true);
  };

  const handleContextAddBuilding = (x: number, y: number) => {
    console.log("Context menu triggered add building at:", x, y);
    setNewBuildingPos({ x, y });
    setIsModalOpen(true);
  };

  const handleRemoveBuilding = () => {
    if (selectedBuildingId) {
      removeBuilding(selectedBuildingId);
    } else {
      toast.error("Please select a building to remove");
    }
  };

  const handleAddBuildingSubmit = (imageUrl: string, _, name: string, scale = 1, fileName = null, redirectUrl?: string) => {
    if (newBuildingPos) {
      console.log("Adding new building:", {
        position: newBuildingPos,
        imageUrl,
        name,
        scale,
        redirectUrl
      });
      const id = placeNewBuilding(imageUrl, 0, name, scale, fileName, redirectUrl, newBuildingPos);
      setIsModalOpen(false);
      toast.success("Building added successfully!");
      return id;
    }
    toast.error("Failed to determine building position");
    return "";
  };

  return (
    <div className="world-container">
      {showRotateAlert && <MobileRotateAlert />}
      
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <Button onClick={saveGridState} variant="secondary">Save Layout</Button>
        <Button onClick={handleLogout} variant="outline">Return to View Mode</Button>
      </div>

      <div className="fixed top-4 left-4 flex gap-2 z-50">
        <Button onClick={handleAddBuilding} variant="secondary">Add Building</Button>
        <Button onClick={handleRemoveBuilding} variant="outline" disabled={!selectedBuildingId}>
          Remove Selected
        </Button>
      </div>

      <GridControls
        gridStyle={gridStyle}
        onStyleChange={setGridStyle}
        onReset={resetGridStyle}
      />

      <BuildingCanvas
        buildings={buildings}
        gridStyle={gridStyle}
        isEditable={true}
        onPositionChange={updateBuildingPosition}
        onScaleChange={updateBuildingScale}
        onBuildingSelect={setSelectedBuildingId}
        selectedBuildingId={selectedBuildingId}
        onAddBuilding={handleContextAddBuilding}
        onRemoveSelected={handleRemoveBuilding}
      />

      {isModalOpen && (
        <BuildingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCell={0}
          onAddBuilding={handleAddBuildingSubmit}
          onRemoveBuilding={() => {}}
          hasExistingBuilding={false}
        />
      )}
    </div>
  );
};

export default AdminPortal;

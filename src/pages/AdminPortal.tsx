
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BuildingModal from "@/components/BuildingModal";
import GridControls from "@/components/admin/GridControls";
import AdminGrid from "@/components/admin/AdminGrid";
import { useAdminGrid } from "@/hooks/use-admin-grid";

const AdminPortal = () => {
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    buildings,
    gridStyle,
    setGridStyle,
    saveGridState,
    resetGridStyle,
    placeNewBuilding,
    removeBuilding,
  } = useAdminGrid();

  const handleLogout = () => {
    window.location.href = '/';
    toast.success("Returned to view mode!");
  };

  const handleCellClick = (cellId: number) => {
    setSelectedCell(cellId);
    setIsModalOpen(true);
  };

  return (
    <div className="world-container">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <Button onClick={saveGridState} variant="secondary">Save Layout</Button>
        <Button onClick={handleLogout} variant="outline">Return to View Mode</Button>
      </div>

      <GridControls
        gridStyle={gridStyle}
        onStyleChange={setGridStyle}
        onReset={resetGridStyle}
      />

      <AdminGrid
        buildings={buildings}
        gridStyle={gridStyle}
        onCellClick={handleCellClick}
      />

      {isModalOpen && selectedCell && (
        <BuildingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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


import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { predefinedBuildings } from "@/utils/buildingData";

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: number | null;
  onAddBuilding: (imageUrl: string, cellId: number, name: string, scale: number, fileName?: string | null) => void;
  onRemoveBuilding?: () => void;
  hasExistingBuilding: boolean;
}

const BuildingModal: React.FC<BuildingModalProps> = ({
  isOpen,
  onClose,
  selectedCell,
  onAddBuilding,
  onRemoveBuilding,
  hasExistingBuilding,
}) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [buildingScale, setBuildingScale] = useState(1.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCell || selectedBuildingId === null) return;

    const building = predefinedBuildings.find(b => b.id === selectedBuildingId);
    if (!building) return;

    onAddBuilding(building.imageUrl, selectedCell, building.name, buildingScale);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedBuildingId(null);
    setBuildingScale(1.0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {hasExistingBuilding ? "Modify Building in Cell" : "Add Building to Grid Cell"}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4" asChild>
            <button type="button" className="text-gray-400 hover:text-gray-500">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogHeader>
        
        <div className="mb-4">
          <p className="text-sm font-medium">Selected Cell: {selectedCell}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label>Select Building:</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {predefinedBuildings.map(building => (
                <div 
                  key={building.id} 
                  className={`border p-2 rounded-md cursor-pointer ${selectedBuildingId === building.id ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                  onClick={() => setSelectedBuildingId(building.id)}
                >
                  <div className="h-24 bg-contain bg-center bg-no-repeat mb-2" style={{backgroundImage: `url('${building.imageUrl}')`}} />
                  <p className="text-sm font-medium">{building.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="buildingScale">Scale (0.5-4.0):</Label>
            <input
              id="buildingScale"
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={buildingScale}
              onChange={(e) => setBuildingScale(parseFloat(e.target.value) || 1.0)}
              className="w-full"
            />
            <div className="text-center text-sm">{buildingScale.toFixed(1)}</div>
          </div>

          <div className="flex justify-between">
            {hasExistingBuilding && onRemoveBuilding && (
              <Button type="button" variant="destructive" onClick={() => {
                onRemoveBuilding();
                onClose();
              }}>
                Remove Building
              </Button>
            )}
            <div className="flex-grow" />
            <Button type="submit" disabled={selectedBuildingId === null}>
              {hasExistingBuilding ? 'Update Building' : 'Add Building'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingModal;

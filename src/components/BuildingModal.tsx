
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: number | null;
  onAddBuilding: (imageUrl: string, cellId: number, name: string, scale: number, fileName?: string | null) => void;
}

const BuildingModal: React.FC<BuildingModalProps> = ({
  isOpen,
  onClose,
  selectedCell,
  onAddBuilding,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildingScale, setBuildingScale] = useState(1.0);
  const [fileSelected, setFileSelected] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCell) return;

    if (fileSelected) {
      const finalImageUrl = URL.createObjectURL(fileSelected);
      onAddBuilding(finalImageUrl, selectedCell, buildingName || "Unnamed Building", buildingScale, fileSelected.name);
    } else if (imageUrl) {
      onAddBuilding(imageUrl, selectedCell, buildingName || "Unnamed Building", buildingScale);
    } else {
      alert("Please provide an image file or URL");
      return;
    }

    // Reset form and close modal
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setImageUrl("");
    setBuildingName("");
    setBuildingScale(1.0);
    setFileSelected(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Building to Grid Cell</DialogTitle>
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
            <Label htmlFor="buildingImage">Building Image:</Label>
            <Input 
              id="buildingImage" 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="buildingUrl">Or Image URL:</Label>
            <Input 
              id="buildingUrl" 
              type="text" 
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="buildingName">Building Name:</Label>
            <Input 
              id="buildingName" 
              type="text" 
              placeholder="Town Hall"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="buildingScale">Scale (0.5-4.0):</Label>
            <Input 
              id="buildingScale" 
              type="number" 
              min="0.5" 
              max="4.0" 
              step="0.1" 
              value={buildingScale}
              onChange={(e) => setBuildingScale(parseFloat(e.target.value) || 1.0)}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Add Building</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingModal;

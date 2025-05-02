
import { useState, useEffect } from "react";
import { Building } from "@/types/building";
import { toast } from "sonner";
import { STORAGE_KEYS } from "@/utils/buildingData";

export type BuildingsState = {
  [key: string]: Building;
};

export type GridStyleState = {
  perspective: number;
  width: number;
  orientation: number;
};

export const DEFAULT_GRID_STYLE: GridStyleState = {
  perspective: 1000,
  width: 90,
  orientation: 0,
};

export const useAdminGrid = () => {
  const [buildings, setBuildings] = useState<BuildingsState>({});
  const [gridStyle, setGridStyle] = useState<GridStyleState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRID_STYLE);
    return saved ? JSON.parse(saved) : DEFAULT_GRID_STYLE;
  });
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  useEffect(() => {
    loadGridState();
  }, []);

  useEffect(() => {
    if (Object.keys(buildings).length > 0) {
      localStorage.setItem(STORAGE_KEYS.GRID_DATA, JSON.stringify(buildings));
    }
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRID_STYLE, JSON.stringify(gridStyle));
  }, [gridStyle]);

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

  const resetGridStyle = () => {
    setGridStyle(DEFAULT_GRID_STYLE);
    toast.success("Grid style reset to defaults");
  };

  const placeNewBuilding = (
    imageUrl: string,
    id: number,
    name: string,
    scale: number = 1,
    fileName: string | null = null,
    redirectUrl?: string,
    initialPosition?: {x: number, y: number}
  ) => {
    // Generate a unique ID for the building
    const buildingId = `building-${Date.now()}`;
    
    const newBuilding: Building = {
      id: buildingId,
      imageUrl,
      name,
      scale,
      fileName,
      redirectUrl,
      position: { 
        x: initialPosition?.x || window.innerWidth / 2, 
        y: initialPosition?.y || window.innerHeight / 2,
        rotation: 0
      }
    };

    setBuildings((prev) => ({
      ...prev,
      [buildingId]: newBuilding
    }));
    
    setSelectedBuildingId(buildingId);
    return buildingId;
  };

  const updateBuildingPosition = (buildingId: string, position: Partial<Building['position']>) => {
    setBuildings(prev => {
      if (!prev[buildingId]) return prev;
      
      return {
        ...prev,
        [buildingId]: {
          ...prev[buildingId],
          position: {
            ...prev[buildingId].position,
            ...position
          }
        }
      };
    });
  };

  const updateBuildingScale = (buildingId: string, scale: number) => {
    setBuildings(prev => {
      if (!prev[buildingId]) return prev;
      
      return {
        ...prev,
        [buildingId]: {
          ...prev[buildingId],
          scale
        }
      };
    });
  };

  const removeBuilding = (buildingId: string) => {
    setBuildings((prev) => {
      const updated = { ...prev };
      delete updated[buildingId];
      return updated;
    });
    
    if (selectedBuildingId === buildingId) {
      setSelectedBuildingId(null);
    }
    
    toast.success("Building removed successfully!");
  };

  return {
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
  };
};

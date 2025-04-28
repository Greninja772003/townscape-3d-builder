import { useState, useEffect } from "react";
import { Building } from "@/types/building";
import { toast } from "sonner";
import { STORAGE_KEYS } from "@/utils/buildingData";
import { ROWS, COLS, MERGED_CELLS } from "@/constants/grid";

export type BuildingsState = {
  [key: string]: Building;
};

export type GridStyleState = {
  rotation: number;
  scale: number;
  marginBottom: number;
  perspective: number;
  horizontalPosition: number;
};

export const DEFAULT_GRID_STYLE: GridStyleState = {
  rotation: 30,
  scale: 1.2,
  marginBottom: 10,
  perspective: 1000,
  horizontalPosition: 50,
};

export const useAdminGrid = () => {
  const [buildings, setBuildings] = useState<BuildingsState>({});
  const [gridStyle, setGridStyle] = useState<GridStyleState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRID_STYLE);
    return saved ? JSON.parse(saved) : DEFAULT_GRID_STYLE;
  });

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
      
      const mergedCell = MERGED_CELLS.find(m => m.primary === cellId);
      if (mergedCell) {
        delete updated[`cell-${mergedCell.secondary}`];
      }
      
      return updated;
    });
    
    toast.success("Building removed successfully!");
  };

  return {
    buildings,
    gridStyle,
    setGridStyle,
    saveGridState,
    resetGridStyle,
    placeNewBuilding,
    removeBuilding,
  };
};

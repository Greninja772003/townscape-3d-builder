
import { useState, useEffect } from "react";
import { Building } from "@/types/building";
import { STORAGE_KEYS } from "@/utils/buildingData";

export interface GridStyleState {
  rotation: number;
  scale: number;
  marginBottom: number;
  perspective: number;
}

export const DEFAULT_GRID_STYLE: GridStyleState = {
  rotation: 30,
  scale: 1.2,
  marginBottom: 10,
  perspective: 1000,
};

type BuildingsState = {
  [key: string]: Building;
};

export const useGridState = () => {
  const [buildings, setBuildings] = useState<BuildingsState>({});
  const [gridStyle, setGridStyle] = useState<GridStyleState>(DEFAULT_GRID_STYLE);

  useEffect(() => {
    loadGridState();
  }, []);

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
    }
  };

  return {
    buildings,
    gridStyle,
  };
};

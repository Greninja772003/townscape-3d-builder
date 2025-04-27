
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGridState } from "@/hooks/use-grid-state";
import GridLayout from "@/components/GridLayout";
import MobileRotateAlert from "@/components/MobileRotateAlert";

const Index = () => {
  const [showRotateAlert, setShowRotateAlert] = useState(false);
  const isMobile = useIsMobile();
  const { buildings, gridStyle } = useGridState();

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

  return (
    <div className="world-container">
      {showRotateAlert && <MobileRotateAlert />}

      <GridLayout 
        buildings={buildings}
        gridStyle={gridStyle}
      />
    </div>
  );
};

export default Index;

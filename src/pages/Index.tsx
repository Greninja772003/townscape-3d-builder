
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { isAuthenticated } from "@/utils/buildingData";
import { useGridState } from "@/hooks/use-grid-state";
import GridLayout from "@/components/GridLayout";
import MobileRotateAlert from "@/components/MobileRotateAlert";

const Index = () => {
  const [showRotateAlert, setShowRotateAlert] = useState(false);
  const navigate = useNavigate();
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

  const handleAdminAccess = () => {
    navigate('/admin-portal');
  };

  return (
    <div className="world-container">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        {isAuthenticated() ? (
          <Button onClick={handleAdminAccess} variant="secondary">Edit Layout</Button>
        ) : null}
      </div>

      {showRotateAlert && <MobileRotateAlert />}

      <GridLayout 
        buildings={buildings}
        gridStyle={gridStyle}
      />
    </div>
  );
};

export default Index;


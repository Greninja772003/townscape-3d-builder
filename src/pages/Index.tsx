
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGridState } from "@/hooks/use-grid-state";
import BuildingCanvas from "@/components/BuildingCanvas";
import MobileRotateAlert from "@/components/MobileRotateAlert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showRotateAlert, setShowRotateAlert] = useState(false);
  const isMobile = useIsMobile();
  const { buildings, gridStyle } = useGridState();
  const navigate = useNavigate();

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

  const goToAdminPortal = () => {
    navigate('/admin-portal');
  };

  return (
    <div className="world-container">
      {showRotateAlert && <MobileRotateAlert />}

      <div className="fixed top-4 right-4 z-50">
        <Button onClick={goToAdminPortal} variant="secondary">
          Admin Portal
        </Button>
      </div>

      <BuildingCanvas 
        buildings={buildings}
        gridStyle={gridStyle}
        isEditable={false}
      />
    </div>
  );
};

export default Index;

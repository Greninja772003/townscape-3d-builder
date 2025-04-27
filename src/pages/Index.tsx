
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGridState } from "@/hooks/use-grid-state";
import GridLayout from "@/components/GridLayout";
import MobileRotateAlert from "@/components/MobileRotateAlert";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/buildingData";

const Index = () => {
  const [showRotateAlert, setShowRotateAlert] = useState(false);
  const isMobile = useIsMobile();
  const { buildings, gridStyle } = useGridState();
  const navigate = useNavigate();

  // Handle keyboard shortcut for admin access (Alt+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'a') {
        if (isAuthenticated()) {
          navigate('/admin-portal');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

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


import { useState, useRef, useEffect } from "react";
import { Building } from "@/types/building";
import { RotateCw, Maximize, Minimize } from "lucide-react";

interface DraggableBuildingProps {
  building: Building;
  onPositionChange?: (id: string, position: Partial<{ x: number, y: number, rotation: number }>) => void;
  onScaleChange?: (id: string, scale: number) => void;
  isEditable?: boolean;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

const DraggableBuilding: React.FC<DraggableBuildingProps> = ({
  building,
  onPositionChange,
  onScaleChange,
  isEditable = false,
  onSelect,
  isSelected = false
}) => {
  const buildingRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const startPos = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const startAngle = useRef(0);
  const startScale = useRef(1);
  const startDistance = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditable && building.redirectUrl) {
      e.preventDefault();
      if (building.redirectUrl.startsWith('http')) {
        window.open(building.redirectUrl, '_blank');
      } else {
        window.location.href = building.redirectUrl;
      }
    } else if (isEditable && onSelect) {
      onSelect(building.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable || isRotating || isResizing) return;
    
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    
    e.stopPropagation();
  };

  const handleRotateStart = (e: React.MouseEvent) => {
    if (!isEditable) return;
    
    setIsRotating(true);
    const rect = buildingRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      startAngle.current = Math.atan2(e.clientY - centerY, e.clientX - centerX) - 
        (building.position.rotation * Math.PI / 180);
    }
    
    e.stopPropagation();
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEditable) return;
    
    setIsResizing(true);
    startScale.current = building.scale;
    const rect = buildingRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      startDistance.current = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
    }
    
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isRotating && buildingRef.current) {
        const rect = buildingRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let newRotation = ((angle - startAngle.current) * 180 / Math.PI) % 360;
        
        if (onPositionChange) {
          onPositionChange(building.id, { rotation: newRotation });
        }
      } else if (isResizing && buildingRef.current) {
        const rect = buildingRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        
        const scaleFactor = distance / startDistance.current;
        const newScale = Math.max(0.2, Math.min(3, startScale.current * scaleFactor));
        
        if (onScaleChange) {
          onScaleChange(building.id, newScale);
        }
      } else if (isDragging.current) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        
        startPos.current = { x: e.clientX, y: e.clientY };
        
        if (onPositionChange) {
          onPositionChange(building.id, {
            x: building.position.x + dx,
            y: building.position.y + dy
          });
        }
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      setIsRotating(false);
      setIsResizing(false);
    };

    if (isDragging.current || isRotating || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [building, isRotating, isResizing, onPositionChange, onScaleChange]);

  // For touch events
  useEffect(() => {
    const element = buildingRef.current;
    if (!element || !isEditable) return;

    let lastTouchX = 0;
    let lastTouchY = 0;
    let initialDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        isDragging.current = true;
      } else if (e.touches.length === 2) {
        // Two finger gesture - for rotation/scaling
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        setIsResizing(true);
        isDragging.current = false;
      }
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        
        if (onPositionChange) {
          onPositionChange(building.id, {
            x: building.position.x + dx,
            y: building.position.y + dy
          });
        }
      } else if (isResizing && e.touches.length === 2) {
        // Handle scaling with pinch
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        
        const scaleFactor = distance / initialDistance;
        initialDistance = distance;
        
        if (onScaleChange) {
          const newScale = Math.max(0.2, Math.min(3, building.scale * scaleFactor));
          onScaleChange(building.id, newScale);
        }
      }
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      setIsResizing(false);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [building, isEditable, onPositionChange, onScaleChange]);

  return (
    <div
      ref={buildingRef}
      className={`draggable-building ${isEditable ? 'editable' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        backgroundImage: `url('${building.imageUrl}')`,
        transform: `translate(${building.position.x}px, ${building.position.y}px) rotate(${building.position.rotation}deg) scale(${building.scale})`,
        cursor: isEditable ? 'move' : (building.redirectUrl ? 'pointer' : 'default')
      }}
    >
      {isEditable && (
        <>
          <div 
            className="control-handle rotate-handle" 
            onMouseDown={handleRotateStart}
            title="Rotate"
          >
            <RotateCw size={16} />
          </div>
          <div 
            className="control-handle resize-handle" 
            onMouseDown={handleResizeStart}
            title="Resize"
          >
            {isResizing ? <Minimize size={16} /> : <Maximize size={16} />}
          </div>
        </>
      )}
    </div>
  );
};

export default DraggableBuilding;

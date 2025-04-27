
import { Building } from "@/types/building";
import { useNavigate } from "react-router-dom";

interface GridCellProps {
  cellId: number;
  row: number;
  col: number;
  onClick: (cellId: number) => void;
  building?: Building;
  fixedRotation: number;
  isEditable?: boolean;
  isMerged?: boolean;
}

const GridCell: React.FC<GridCellProps> = ({
  cellId,
  row,
  col,
  onClick,
  building,
  fixedRotation,
  isEditable = false,
  isMerged = false,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (isEditable) {
      onClick(cellId);
    } else if (building?.redirectUrl) {
      e.preventDefault();
      if (building.redirectUrl.startsWith('http')) {
        window.open(building.redirectUrl, '_blank');
      } else {
        navigate(building.redirectUrl);
      }
    }
  };

  return (
    <div 
      className={`grid-cell ${isEditable ? 'editable' : ''} ${building?.redirectUrl ? 'cursor-pointer' : ''} ${isMerged ? 'merged-cell' : ''}`}
      id={`cell-${cellId}`}
      data-row={row}
      data-col={col}
      onClick={handleClick}
      style={isMerged ? { gridColumn: 'span 2' } : undefined}
    >
      {/* Remove cell number display */}
      <div className="inner-content"></div>
      {building && (
        <div 
          className="building"
          title={`${building.name}${building.redirectUrl ? ' - Click to open link' : ''}`}
          style={{
            backgroundImage: `url('${building.imageUrl}')`,
            transform: `rotateX(-${fixedRotation}deg) translateZ(20px) scale(${building.scale})`,
          }}
        ></div>
      )}
    </div>
  );
};

export default GridCell;

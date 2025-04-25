
import { Building } from "@/pages/Index";
import { useNavigate } from "react-router-dom";

interface GridCellProps {
  cellId: number;
  row: number;
  col: number;
  onClick: (cellId: number) => void;
  building?: Building;
  fixedRotation: number;
  isEditable?: boolean;
}

const GridCell: React.FC<GridCellProps> = ({
  cellId,
  row,
  col,
  onClick,
  building,
  fixedRotation,
  isEditable = false,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (isEditable) {
      onClick(cellId);
    } else if (building?.redirectUrl) {
      if (building.redirectUrl.startsWith('http')) {
        window.open(building.redirectUrl, '_blank');
      } else {
        navigate(building.redirectUrl);
      }
    }
  };

  return (
    <div 
      className={`grid-cell ${isEditable ? 'editable' : ''} ${building?.redirectUrl ? 'cursor-pointer' : ''}`}
      id={`cell-${cellId}`}
      data-row={row}
      data-col={col}
      onClick={handleClick}
    >
      <div className="inner-content">
        {cellId}
      </div>
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

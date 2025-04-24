
import { Building } from "@/pages/Index";

interface GridCellProps {
  cellId: number;
  row: number;
  col: number;
  onClick: (cellId: number) => void;
  building?: Building;
  fixedRotation: number;
}

const GridCell: React.FC<GridCellProps> = ({
  cellId,
  row,
  col,
  onClick,
  building,
  fixedRotation,
}) => {
  return (
    <div 
      className="grid-cell" 
      id={`cell-${cellId}`}
      data-row={row}
      data-col={col}
      onClick={() => onClick(cellId)}
    >
      <div className="inner-content">
        {cellId}
      </div>
      {building && (
        <div 
          className="building"
          title={building.name}
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

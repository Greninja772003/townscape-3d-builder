
import { ROWS, COLS, MERGED_CELLS } from "@/constants/grid";
import GridCell from "@/components/GridCell";
import { Building } from "@/types/building";
import { GridStyleState } from "@/hooks/use-admin-grid";

interface AdminGridProps {
  buildings: { [key: string]: Building };
  gridStyle: GridStyleState;
  onCellClick: (cellId: number) => void;
}

const AdminGrid = ({ buildings, gridStyle, onCellClick }: AdminGridProps) => {
  const gridCells = Array.from({ length: ROWS * COLS }, (_, i) => {
    const cellId = i + 1;
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    
    const isSecondary = MERGED_CELLS.some(merge => merge.secondary === cellId);
    if (isSecondary) return null;
    
    const isMerged = MERGED_CELLS.some(merge => merge.primary === cellId);
    
    return { cellId, row, col, isMerged };
  }).filter(Boolean);

  const gridTransformStyles = {
    transform: `perspective(${gridStyle.perspective}px) rotateZ(${gridStyle.orientation}deg)`,
    width: `${gridStyle.width}%`,
    position: 'relative' as const,
    left: '50%',
    transform: `translateX(-50%)`,
  };

  return (
    <div 
      className="parent" 
      id="grid-container"
      style={gridTransformStyles}
    >
      {gridCells.map((cell) => (
        <GridCell
          key={cell.cellId}
          cellId={cell.cellId}
          row={cell.row}
          col={cell.col}
          onClick={onCellClick}
          building={buildings[`cell-${cell.cellId}`]}
          fixedRotation={0}
          isEditable={true}
          isMerged={cell.isMerged}
        />
      ))}
    </div>
  );
};

export default AdminGrid;

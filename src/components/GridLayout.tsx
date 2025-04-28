
import { Building } from "@/types/building";
import { ROWS, COLS, MERGED_CELLS } from "@/constants/grid";
import GridCell from "./GridCell";

interface GridLayoutProps {
  buildings: { [key: string]: Building };
  gridStyle: {
    rotation: number;
    scale: number;
    marginBottom: number;
    perspective: number;
    horizontalPosition: number; // Added this
    width: number; // Added this
    orientation: number; // Added this
  };
}

const GridLayout = ({ buildings, gridStyle }: GridLayoutProps) => {
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
    transform: `perspective(${gridStyle.perspective}px) rotateZ(${gridStyle.orientation}deg) rotateX(${gridStyle.rotation}deg) scale(${gridStyle.scale}) translateX(-50%)`,
    marginBottom: `calc(${gridStyle.marginBottom}% - 15px)`,
    width: `${gridStyle.width}%`,
    left: `${gridStyle.horizontalPosition}%`,
    position: 'relative' as const,
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
          onClick={() => {}} // View mode has no click handler
          building={buildings[`cell-${cell.cellId}`]}
          fixedRotation={gridStyle.rotation}
          isEditable={false}
          isMerged={cell.isMerged}
        />
      ))}
    </div>
  );
};

export default GridLayout;

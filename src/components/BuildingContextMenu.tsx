
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MapPin, Trash2 } from "lucide-react";

interface BuildingContextMenuProps {
  children: React.ReactNode;
  onAdd: (x: number, y: number) => void;
  onRemove: () => void;
  showRemoveOption: boolean;
  isEditable: boolean;
}

const BuildingContextMenu: React.FC<BuildingContextMenuProps> = ({
  children,
  onAdd,
  onRemove,
  showRemoveOption,
  isEditable
}) => {
  const handleContextMenuAdd = (e: React.MouseEvent) => {
    // Use the coordinates from the context menu event
    onAdd(e.clientX, e.clientY);
  };

  if (!isEditable) {
    return <>{children}</>;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={handleContextMenuAdd} className="cursor-pointer">
          <MapPin className="mr-2 h-4 w-4" />
          Place Building
        </ContextMenuItem>
        
        {showRemoveOption && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onRemove} className="cursor-pointer text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Building
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default BuildingContextMenu;

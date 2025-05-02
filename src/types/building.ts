
export interface Position {
  x: number;
  y: number;
  rotation: number;
}

export interface Building {
  id: string;
  imageUrl: string;
  name: string;
  scale: number;
  fileName?: string | null;
  redirectUrl?: string;
  position: Position;
}

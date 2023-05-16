export type MeshAxis = {
  x: number;
  y: number;
  z: number;
};

export type YAxis = Pick<MeshAxis, 'y'>;

export type Direction = 'left' | 'right' | 'up' | 'down';

import { Vector3 } from 'three';

export type InstrumentType = 'vocal' | 'guitar' | 'drum' | 'piano' | 'bass';

export type InstrumentData = {
  id: string;
  type: InstrumentType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  url: string;
  spotLightTarget: Vector3;
  spotLightPosition: Vector3;
  spotLightAngle: number;
};

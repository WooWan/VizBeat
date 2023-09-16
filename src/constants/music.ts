import { AudioTrack, AudioType, InstrumentData } from '@/types/instrument';
import { Vector3 } from 'three';
export const RADIAN = Math.PI / 180;

export const instruments: InstrumentData[] = [
  {
    id: 'A73D9F21B60E',
    type: 'vocal',
    position: [0, -11, 30],
    rotation: [0, RADIAN * 90, 0],
    scale: [35, 35, 35],
    url: '/gltf/microphone/output.gltf',
    spotLightTarget: new Vector3(0, 0, 300),
    spotLightPosition: new Vector3(0, 60, 30),
    spotLightAngle: 0.25
  },
  {
    id: '4B8E12C07934',
    type: 'drum',
    position: [53, -2, -12],
    rotation: [0, RADIAN * 0, 0],
    scale: [0.015, 0.015, 0.015],
    url: '/gltf/drum/output.gltf',
    spotLightTarget: new Vector3(320, 0, -100),
    spotLightPosition: new Vector3(32, 60, 10),
    spotLightAngle: 0.32
  },
  {
    id: 'F9C610D328A7',
    type: 'guitar',
    position: [60, -5, 14],
    rotation: [0, RADIAN * 0, 0],
    scale: [24, 24, 24],
    url: '/gltf/guitar/output.gltf',
    spotLightTarget: new Vector3(750, 0, 100),
    spotLightPosition: new Vector3(75, 60, 10),
    spotLightAngle: 0.22
  },
  {
    id: '7E2301B49D02',
    type: 'bass',
    position: [-75, -11, 9.5],
    rotation: [RADIAN * 90, RADIAN * 0, RADIAN * 90],
    scale: [25, 25, 25],
    url: '/gltf/bass/output.gltf',
    spotLightTarget: new Vector3(-750, 0, 100),
    spotLightPosition: new Vector3(-75, 60, 10),
    spotLightAngle: 0.22
  },
  {
    id: '836492FAE1C8',
    type: 'piano',
    position: [-32.5, 0, -16],
    rotation: [0, RADIAN * 0, 0],
    scale: [15, 15, 15],
    url: '/gltf/piano/output.gltf',
    spotLightTarget: new Vector3(-320, 0, -100),
    spotLightPosition: new Vector3(-32, 60, 10),
    spotLightAngle: 0.32
  }
];

export const audioTracks: AudioTrack[] = instruments
  .map((instrument) => ({
    id: instrument.id,
    type: instrument.type as AudioType
  }))
  .concat([
    {
      id: '92FD9F21B60E',
      type: 'other'
    }
  ]);

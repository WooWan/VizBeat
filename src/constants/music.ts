import { AudioTrack, InstrumentData } from '@/types/instrument';
import { Vector3 } from 'three';
export const RADIAN = Math.PI / 180;

export const instruments: InstrumentData[] = [
  {
    id: 'A73D9F21B60E',
    type: 'vocal',
    position: [0, -15, 30],
    rotation: [0, 0, 0],
    scale: [0.3, 0.3, 0.3],
    url: '/gltf/microphone/scene.gltf',
    spotLightTarget: new Vector3(0, 0, 300),
    spotLightPosition: new Vector3(0, 60, 30),
    spotLightAngle: 0.25
  },
  {
    id: '4B8E12C07934',
    type: 'drum',
    position: [32, -10, -20],
    rotation: [0, RADIAN * -20, 0],
    scale: [18, 18, 18],
    url: '/gltf/drum/scene.glb',
    spotLightTarget: new Vector3(320, 0, -100),
    spotLightPosition: new Vector3(32, 60, 10),
    spotLightAngle: 0.32
  },
  {
    id: '7E2301B49D02',
    type: 'bass',
    position: [-75, -10, 8],
    rotation: [0, RADIAN * 30, 0],
    scale: [2.25, 2.25, 2.25],
    url: '/gltf/bass/scene.gltf',
    spotLightTarget: new Vector3(-750, 0, 100),
    spotLightPosition: new Vector3(-75, 60, 10),
    spotLightAngle: 0.22
  },
  {
    id: 'F9C610D328A7',
    type: 'guitar',
    position: [73, -6, 12],
    rotation: [0, RADIAN * -30, 0],
    scale: [23, 23, 23],
    url: '/gltf/guitar/scene.gltf',
    spotLightTarget: new Vector3(750, 0, 100),
    spotLightPosition: new Vector3(75, 60, 10),
    spotLightAngle: 0.22
  },
  {
    id: '836492FAE1C8',
    type: 'piano',
    position: [-32, -10, -16],
    rotation: [0, RADIAN * 10, 0],
    scale: [0.5, 0.5, 0.5],
    url: '/gltf/piano/scene.gltf',
    spotLightTarget: new Vector3(-320, 0, -100),
    spotLightPosition: new Vector3(-32, 60, 10),
    spotLightAngle: 0.32
  }
];

export const audioTracks: AudioTrack[] = [
  {
    id: 'A73D9F21B60E',
    type: 'vocal'
  },
  {
    id: '4B8E12C07934',
    type: 'drum'
  },
  {
    id: 'F9C610D328A7',
    type: 'guitar'
  },
  {
    id: '7E2301B49D02',
    type: 'bass'
  },
  {
    id: '836492FAE1C8',
    type: 'piano'
  },
  {
    id: 'A73D9F21B60E',
    type: 'other'
  }
];

export const RADIAN = Math.PI / 180;

export const instruments = [
  {
    position: [32, -10, -20],
    rotation: [0, RADIAN * -20, 0],
    scale: [18, 18, 18],
    url: '/gltf/drum/scene.glb'
  },
  {
    position: [-32, -10, -16],
    rotation: [0, RADIAN * 10, 0],
    scale: [0.5, 0.5, 0.5],
    url: '/gltf/piano/scene.gltf'
  },
  {
    position: [73, -6, 12],
    rotation: [0, RADIAN * -0.75, 0],
    scale: [2.25, 2.25, 2.25],
    url: '/gltf/bass/scene.gltf'
  },
  {
    position: [-75, -10, 8],
    rotation: [0, RADIAN * 30, 0],
    scale: [23, 23, 23],
    url: '/gltf/guitar/scene.gltf'
  },
  {
    position: [0, -15, 30],
    rotation: [0, 0, 0],
    scale: [0.3, 0.3, 0.3],
    url: '/gltf/microphone/scene.gltf'
  }
];

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Model from '@/components/Model';
import { OrbitControls, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { create } from 'zustand';
import { useControls } from 'leva';

type ThreeState = {
  target: THREE.Object3D | null;
  setTarget: (target: THREE.Object3D) => void;
};
export const useStore = create<ThreeState>((set) => ({
  target: null,
  setTarget: (target) => set({ target })
}));

const Index = () => {
  const { target, setTarget } = useStore();
  const spotRef = useRef<THREE.SpotLight>(null!);
  const RADIAN = Math.PI / 180;
  const { mode } = useControls({
    mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] }
  });
  return (
    <div className={'grid grid-cols-[350px_1fr]'}>
      <div>
        <h1>Music Title</h1>
        <img src="/album/aimyon.jpeg" />
        <p>
          Vocal : <audio id="vocal" controls src=""></audio>
          Guitar : <audio id="guitar" controls src=""></audio>
          Piano : <audio id="piano" controls src=""></audio>
          Bass : <audio id="bass" controls src=""></audio>
          Drum : <audio id="drum" controls src=""></audio>
        </p>
      </div>
      <Canvas
        camera={{
          zoom: 2.7,
          position: [0, 15, 140],
          fov: 100,
          near: 0.1,
          far: 3000
        }}
      >
        <fog attach={'fog'} args={['black', 0.1, 1600]} />
        <color attach="background" args={[0xb8dff8]} />
        <Suspense fallback={<>...loading</>}>
          {/*<Model*/}
          {/*  position={[0, 30, 90]}*/}
          {/*  rotation={[0, 145 * RADIAN, 0]}*/}
          {/*  scale={[30, 30, 30]}*/}
          {/*  url="/gltf/georgeville_beach_ns/scene.gltf"*/}
          {/*/>*/}
          {/*<Model*/}
          {/*  position={[0, -50, 0]}*/}
          {/*  scale={[0.1, 0.1, 0.1]}*/}
          {/*  url="/gltf/simple_concert_stage/scene.gltf"*/}
          {/*/>*/}
          {/*<primitive*/}
          {/*    // zIndex={1}*/}
          {/*    // className={'bg-amber-50 h-96 w-96'}*/}
          {/*    onClick={(e) => setTarget(e.object)}*/}
          {/*    scale={props.scale}*/}
          {/*    rotation={props.rotation}*/}
          {/*    position={[0, -50, 0]}*/}
          {/*    object={result.scene}*/}
          {/*/>*/}
          <Model
            position={[50, -55, -20]}
            rotation={[RADIAN * 12, RADIAN * 90, 0]}
            scale={[20, 20, 20]}
            url="gltf/electric_guitar/scene.gltf"
          />
          {target && <TransformControls object={target} />}
          <Model position={[30, -45, -20]} scale={[2.5, 2.5, 2.5]} url="/gltf/bass/scene.gltf" />
          <Model
            position={[-15, -55, -20]}
            rotation={[0, RADIAN * 180, 0]}
            scale={[1.5, 1.5, 1.5]}
            url="gltf/low_poly_mic_stand/scene.gltf"
          />
          <Model position={[22, -39, -50]} scale={[0.015, 0.015, 0.015]} url="/gltf/drum_kit/scene.gltf" />
          <Model position={[25, -55, -30]} scale={[10, 10, 10]} url="/gltf/piano/scene.gltf" />
        </Suspense>
        <OrbitControls />
        <axesHelper args={[30]} />
        <spotLight ref={spotRef} position={[0, 50, 50]} angle={RADIAN * 60} penumbra={0.5} castShadow />
        <ambientLight intensity={1} />
      </Canvas>
    </div>
  );
};

export default Index;

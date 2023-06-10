import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { create } from 'zustand';
import StageGround from '@/components/StageGround';
import Rig from '@/components/Rig';
import StageSpotLight from '@/components/StageSpotLight';
import MusicAnalyzer from '@/components/MusicAnalyzer';
import Instrumental from '@/components/Instrumental';
import Loading from '@/components/Loading';
import { useMusicPlayStore } from '@/store/music';
import { shallow } from 'zustand/shallow';
import MusicPlayToggleButton from '@/components/MusicPlayToggleButton';

type ThreeState = {
  target: THREE.Object3D | null;
  setTarget: (target: THREE.Object3D) => void;
};
export const useStore = create<ThreeState>((set) => ({
  target: null,
  setTarget: (target) => set({ target })
}));

const StagePage = () => {
  const { isMusicPlay, setIsMusicPlay } = useMusicPlayStore(
    (state) => ({ isMusicPlay: state.isMusicPlay, setIsMusicPlay: state.setIsMusicPlay }),
    shallow
  );
  const vocalRef = useRef<HTMLAudioElement>(null!);
  const guitarRef = useRef<HTMLAudioElement>(null!);
  const pianoRef = useRef<HTMLAudioElement>(null!);
  const bassRef = useRef<HTMLAudioElement>(null!);
  const drumRef = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    if (isMusicPlay) {
      vocalRef.current.play();
      guitarRef.current.play();
      pianoRef.current.play();
      bassRef.current.play();
      drumRef.current.play();
    } else {
      vocalRef.current.pause();
      guitarRef.current.pause();
      pianoRef.current.pause();
      bassRef.current.pause();
      drumRef.current.pause();
    }
  }, [isMusicPlay]);

  const radian = Math.PI / 180;

  return (
    <section className={'relative'}>
      <audio ref={vocalRef} src="/music/vocal.wav"></audio>
      <audio ref={guitarRef} src="/music/guitar.wav"></audio>
      <audio ref={pianoRef} src="/music/piano.wav"></audio>
      <audio ref={bassRef} src="/music/bass.wav"></audio>
      <audio ref={drumRef} src="/music/drum.wav"></audio>
      <MusicPlayToggleButton />
      <Suspense fallback={<Loading />}>
        <Canvas
          camera={{
            position: [0, 20, 0],
            fov: 80,
            near: 0.1,
            far: 300,
            zoom: 1
          }}
          style={{ width: '100vw', height: '100vh' }}
        >
          <color attach="background" args={['white']} />
          <Suspense fallback={null}>
            <Rig>
              <StageGround />
              <Instrumental
                position={[32, -10, -20]}
                rotation={[0, radian * -20, 0]}
                scale={[18, 18, 18]}
                url="/gltf/drum/scene.gltf"
              />
              <Instrumental
                position={[-32, -10, -16]}
                rotation={[0, radian * 10, 0]}
                scale={[0.5, 0.5, 0.5]}
                url="/gltf/piano/scene.gltf"
              />
              <Instrumental
                position={[73, -6, 12]}
                rotation={[0, radian * -0.75, 0]}
                scale={[2.25, 2.25, 2.25]}
                url="/gltf/guitar1/scene.gltf"
              />
              <Instrumental
                position={[-75, -10, 8]}
                rotation={[0, radian * 30, 0]}
                scale={[23, 23, 23]}
                url="/gltf/guitar/scene.gltf"
              />
              <Instrumental
                position={[0, -15, 30]}
                rotation={[0, 0, 0]}
                scale={[0.3, 0.3, 0.3]}
                url={'/gltf/microphone/scene.gltf'}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.22}
                target={new THREE.Vector3(750, 0, 100)}
                position={new THREE.Vector3(75, 60, 10)}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.22}
                target={new THREE.Vector3(-750, 0, 100)}
                position={new THREE.Vector3(-75, 60, 10)}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.32}
                target={new THREE.Vector3(320, 0, -100)}
                position={new THREE.Vector3(32, 60, 10)}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.32}
                target={new THREE.Vector3(-320, 0, -100)}
                position={new THREE.Vector3(-32, 60, 10)}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.25}
                target={new THREE.Vector3(0, 0, 300)}
                position={new THREE.Vector3(0, 60, 30)}
              />
              <MusicAnalyzer
                isPlay={isMusicPlay}
                music={guitarRef}
                fftSize={128}
                centerPos={[75, -26, 10]}
                radius={6}
              />
              <MusicAnalyzer isPlay={isMusicPlay} music={vocalRef} fftSize={128} centerPos={[0, -26, 30]} radius={6} />
              <MusicAnalyzer isPlay={isMusicPlay} music={bassRef} fftSize={128} centerPos={[-75, -26, 10]} radius={2} />
              <MusicAnalyzer
                isPlay={isMusicPlay}
                music={drumRef}
                fftSize={128}
                centerPos={[32, -26, -10]}
                radius={16}
              />
              <MusicAnalyzer
                isPlay={isMusicPlay}
                music={pianoRef}
                fftSize={128}
                centerPos={[-32, -26, -10]}
                radius={16}
              />
            </Rig>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          <ambientLight intensity={0.4} />
        </Canvas>
      </Suspense>
    </section>
  );
};

export default StagePage;

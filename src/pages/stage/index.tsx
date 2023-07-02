import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { create } from 'zustand';
import StageGround from '@/components/StageGround';
import Rig from '@/components/Rig';
import StageSpotLight from '@/components/StageSpotLight';
import MusicAnalyzer from '@/components/MusicAnalyzer';
import Instrument from '@/components/Instrumental';
import Loading from '@/components/Loading';
import { useMusicPlayStore } from '@/store/music';
import MusicPlayToggleButton from '@/components/MusicPlayToggleButton';
import { instruments } from '@/constants/music';
import { stages } from '@/constants/stage';
import { Object3D, Vector3 } from 'three';

type ThreeState = {
  target: Object3D | null;
  setTarget: (target: Object3D) => void;
};

export const useStore = create<ThreeState>((set) => ({
  target: null,
  setTarget: (target) => set({ target })
}));

const StagePage = () => {
  const isMusicPlay = useMusicPlayStore((state) => state.isMusicPlay);
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

  return (
    <section className={'relative'}>
      <audio ref={vocalRef} src="/music/vocal.aac"></audio>
      <audio ref={guitarRef} src="/music/guitar.aac"></audio>
      <audio ref={pianoRef} src="/music/piano.aac"></audio>
      <audio ref={bassRef} src="/music/bass.aac"></audio>
      <audio ref={drumRef} src="/music/drum.aac"></audio>
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
              {instruments.map((instrument, index) => (
                <Instrument
                  key={index}
                  position={instrument.position}
                  rotation={instrument.rotation}
                  scale={instrument.scale}
                  url={instrument.url}
                />
              ))}
              <StageSpotLight
                color={0xffee93}
                angle={0.22}
                target={new Vector3(750, 0, 100)}
                position={new Vector3(75, 60, 10)}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.22}
                target={new Vector3(-750, 0, 100)}
                position={new Vector3(-75, 60, 10)}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.32}
                target={new Vector3(320, 0, -100)}
                position={new Vector3(32, 60, 10)}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.32}
                target={new Vector3(-320, 0, -100)}
                position={new Vector3(-32, 60, 10)}
              />
              <StageSpotLight
                color={0xffee93}
                angle={0.25}
                target={new Vector3(0, 0, 300)}
                position={new Vector3(0, 60, 30)}
              />
              <MusicAnalyzer music={guitarRef} fftSize={128} centerPos={[75, -26, 10]} radius={6} />
              <MusicAnalyzer music={vocalRef} fftSize={128} centerPos={[0, -26, 30]} radius={6} />
              <MusicAnalyzer music={bassRef} fftSize={128} centerPos={[-75, -26, 10]} radius={2} />
              <MusicAnalyzer music={drumRef} fftSize={128} centerPos={[32, -26, -10]} radius={16} />
              <MusicAnalyzer music={pianoRef} fftSize={128} centerPos={[-32, -26, -10]} radius={16} />
            </Rig>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          <ambientLight intensity={0.4} />
        </Canvas>
      </Suspense>
    </section>
  );
};

useGLTF.preload(instruments.map((instrument) => instrument.url));
useGLTF.preload(stages.map((stage) => stage.url));

export default StagePage;

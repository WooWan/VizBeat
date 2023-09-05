import { instruments } from '@/constants/music';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import Instrument from './Instrument';
import Loading from './Loading';
import MusicAnalyzer from './MusicAnalyzer';
import Rig from './Rig';
import StageGround from './StageGround';

type Props = {
  tracks: HTMLAudioElement[];
};

export default function StageCanvas({ tracks }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Canvas
        camera={{
          position: [0, 30, 30],
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
            {instruments.map((instrument) => (
              <Instrument key={instrument.type} {...instrument} />
            ))}
            <MusicAnalyzer audio={tracks[0]} fftSize={128} centerPos={[0, -26, 30]} radius={8} />
            <MusicAnalyzer audio={tracks[1]} fftSize={128} centerPos={[32, -26, -10]} radius={18} />
            <MusicAnalyzer audio={tracks[2]} fftSize={128} centerPos={[75, -26, 10]} radius={8} />
            <MusicAnalyzer audio={tracks[3]} fftSize={128} centerPos={[-75, -26, 10]} radius={4} />
            <MusicAnalyzer audio={tracks[4]} fftSize={128} centerPos={[-32, -26, -10]} radius={18} />
          </Rig>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        <ambientLight intensity={0.4} />
      </Canvas>
    </Suspense>
  );
}

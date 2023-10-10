import { useRef } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import StageSpotLight from './StageSpotLight';
import { InstrumentData } from '@/types/instrument';
import { useMusicStore } from '@/store/music';
import { useHoverCursor } from '@/hooks/useHoverCursor';

export default function Instrument({
  position,
  rotation,
  spotLightAngle,
  spotLightPosition,
  spotLightTarget,
  url,
  scale,
  type
}: InstrumentData) {
  const result = useGLTF(url);
  const modelRef = useRef(null);
  const [isHovered, setIsHovered] = useHoverCursor();
  const spring = useSpring({ scale: isHovered ? 1.1 : 1 });
  const isMuted = useMusicStore((stage) => stage.audioTracks[type].isMuted);
  const { muteAudio, unMuteAudio } = useMusicStore((state) => state.api);

  return (
    <>
      <animated.mesh
        scale={spring.scale}
        ref={modelRef}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => {
          isMuted ? unMuteAudio(type) : muteAudio(type);
        }}
      >
        <primitive scale={scale} rotation={rotation} position={position} object={result.scene} />
      </animated.mesh>
      {!isMuted && (
        <StageSpotLight color={0xffee93} angle={spotLightAngle} target={spotLightTarget} position={spotLightPosition} />
      )}
    </>
  );
}

useGLTF.preload('/gltf/microphone/model.glb');
useGLTF.preload('/gltf/drum/model.glb');
useGLTF.preload('/gltf/guitar/model.glb');
useGLTF.preload('/gltf/piano/model.glb');
useGLTF.preload('/gltf/bass/model.glb');

import { startTransition, useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import StageSpotLight from './StageSpotLight';
import { InstrumentData } from '@/types/instrument';
import { useMusicStore } from '@/store/music';

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
  const [isHovered, setIsHovered] = useState(false);
  const spring = useSpring({ scale: isHovered ? 1.05 : 1 });
  const isMuted = useMusicStore((stage) => stage.instruments[type].isMuted);
  const { muteAudio, unMuteAudio } = useMusicStore((state) => state.api);

  return (
    <>
      <animated.mesh
        scale={spring.scale}
        ref={modelRef}
        onPointerOver={() => {
          startTransition(() => {
            setIsHovered(true);
          });
        }}
        onPointerOut={() =>
          startTransition(() => {
            setIsHovered(false);
          })
        }
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

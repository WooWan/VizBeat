import { useRef, useState, useTransition } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useGLTF } from '@react-three/drei';
import StageSpotLight from './StageSpotLight';
import { useTrasksMutedStore } from '@/store/music';

const Instrumental = (props) => {
  const result = useGLTF(props.url);
  const modelRef = useRef(null);
  const [_, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);
  const { scale } = useSpring({ scale: isHovered ? 1.05 : 1 });
  const { isMuted, setIsMuted } = useTrasksMutedStore((state) => state[props.track]);

  return (
    <>
      <animated.mesh
        scale={scale}
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
          // console.log('before', isMuted);
          setIsMuted(!isMuted);
          // console.log('after', isMuted);
        }}
      >
        <primitive scale={props.scale} rotation={props.rotation} position={props.position} object={result.scene} />
      </animated.mesh>
      {!isMuted && (
        <StageSpotLight
          color={0xffee93}
          angle={props.SpotLightAngle}
          target={props.SpotLightTarget}
          position={props.SpotLightPosition}
        />
      )}
    </>
  );
};

export default Instrumental;

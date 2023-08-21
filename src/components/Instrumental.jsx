import { useRef, useState, useTransition } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import StageSpotLight from './StageSpotLight';
import { Vector3 } from 'three';

const Instrumental = (props) => {
  const result = useGLTF(props.url);
  const modelRef = useRef(null);
  const [_, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);
  const { scale } = useSpring({ scale: isHovered ? 1.05 : 1 });
  const [isClicked, setIsClicked] = useState(true);

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
          startTransition(() => {
            setIsClicked(!isClicked);
          });
        }}
      >
        <primitive scale={props.scale} rotation={props.rotation} position={props.position} object={result.scene} />
      </animated.mesh>
      {isClicked && (
        <StageSpotLight
          isClicked={isClicked}
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

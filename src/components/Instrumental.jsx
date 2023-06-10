import { useRef, useState, useTransition } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';

const Instrumental = (props) => {
  const result = useGLTF(props.url);
  const modelRef = useRef(null);
  const [_, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);
  const { scale } = useSpring({ scale: isHovered ? 1.05 : 1 });

  return (
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
    >
      <primitive scale={props.scale} rotation={props.rotation} position={props.position} object={result.scene} />
    </animated.mesh>
  );
};

export default Instrumental;

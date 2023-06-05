import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useRef, useState } from 'react';
import { lerp } from 'three/src/math/MathUtils';

const Instrumental = (props) => {
  const result = useLoader(GLTFLoader, props.url);
  const modelRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    modelRef.current.children[0].scale.x = hovered
      ? lerp(modelRef.current.children[0].scale.x, props.scale[0] * 1.1, 0.1)
      : lerp(modelRef.current.children[0].scale.x, props.scale[0], 0.1);

    modelRef.current.children[0].scale.y = hovered
      ? lerp(modelRef.current.children[0].scale.y, props.scale[1] * 1.1, 0.1)
      : lerp(modelRef.current.children[0].scale.y, props.scale[1], 0.1);

    modelRef.current.children[0].scale.z = hovered
      ? lerp(modelRef.current.children[0].scale.z, props.scale[2] * 1.1, 0.1)
      : lerp(modelRef.current.children[0].scale.z, props.scale[2], 0.1);
  });

  return (
    <mesh ref={modelRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <primitive
        // zIndex={1}
        // className={'bg-amber-50 h-96 w-96'}
        scale={props.scale}
        rotation={props.rotation}
        position={props.position}
        object={result.scene}
      />
    </mesh>
  );
};

export default Instrumental;

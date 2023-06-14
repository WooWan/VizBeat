import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useStore } from '@/pages/stage';

const Model = (props) => {
  const { setTarget } = useStore();
  const result = useLoader(GLTFLoader, props.url);

  return (
    <primitive
      onClick={(e) => setTarget(e.object)}
      scale={props.scale}
      rotation={props.rotation}
      position={props.position}
      object={result.scene}
    />
  );
};

export default Model;

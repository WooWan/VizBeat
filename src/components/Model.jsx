import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useStore } from '@/pages/stage';

const Model = (props) => {
  const { target, setTarget } = useStore();
  const result = useLoader(GLTFLoader, props.url);

  return (
    <primitive
      // zIndex={1}
      // className={'bg-amber-50 h-96 w-96'}
      onClick={(e) => setTarget(e.object)}
      scale={props.scale}
      rotation={props.rotation}
      position={props.position}
      object={result.scene}
    />
  );
};

export default Model;

import { useGLTF } from '@react-three/drei';

function Warehouse(props) {
  const model = useGLTF('/gltf/warehouse/model.glb');
  return <primitive object={model.scene} {...props} />;
}

export default Warehouse;

useGLTF.preload('/gltf/warehouse/model.glb');

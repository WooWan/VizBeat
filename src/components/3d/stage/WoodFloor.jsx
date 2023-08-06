import { useGLTF } from '@react-three/drei';

export default function WoodFloor(props) {
  const { nodes, materials } = useGLTF('/gltf/wood_floor/scene.glb');
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.pPlane1_lambert1_0.geometry} material={materials.lambert1} />
    </group>
  );
}

useGLTF.preload('/gltf/wood_floor/scene.glb');

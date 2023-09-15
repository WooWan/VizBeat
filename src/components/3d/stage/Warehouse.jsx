import { useGLTF } from '@react-three/drei';

export default function Warehouse(props) {
  const { nodes, materials } = useGLTF('/gltf/warehouse/scene-transformed.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Object_2.geometry}
        material={materials.Destroyed_warehouse_in_Kaarina_finland}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh geometry={nodes.Object_12.geometry} material={materials.Base} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

useGLTF.preload('/gltf/warehouse/scene-transformed.glb');

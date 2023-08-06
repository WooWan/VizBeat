import { useGLTF } from '@react-three/drei';

export default function Garage(props) {
  const { nodes, materials } = useGLTF('/gltf/old_garage/scene.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes['Box001_Material_#2100603827_0'].geometry}
        material={materials.Material_2100603827}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603823_0'].geometry}
        material={materials.Material_2100603823}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603825_0'].geometry}
        material={materials.Material_2100603825}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603826_0'].geometry}
        material={materials.Material_2100603826}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603822_0'].geometry}
        material={materials.Material_2100603822}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#26_0'].geometry}
        material={materials.Material_26}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603820_0'].geometry}
        material={materials.Material_2100603820}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603819_0'].geometry}
        material={materials.Material_2100603819}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603818_0'].geometry}
        material={materials.Material_2100603818}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603821_0'].geometry}
        material={materials.Material_2100603821}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
      <mesh
        geometry={nodes['Box001_Material_#2100603824_0'].geometry}
        material={materials.Material_2100603824}
        position={[969.167, 0, -1201.142]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.989, 2.773, 2.259]}
      />
    </group>
  );
}

useGLTF.preload('/gltf/old_garage/scene.glb');

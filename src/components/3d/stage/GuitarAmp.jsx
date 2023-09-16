import { useGLTF } from '@react-three/drei';

export default function GuitarAmp(props) {
  const { nodes, materials } = useGLTF('/gltf/marshall_amp_combo/output.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Object_4.geometry}
        material={materials.MarshallComboMaterial}
        position={[-0.022, 0.231, 0.002]}
        scale={[1.012, 1, 1]}
      />
    </group>
  );
}

useGLTF.preload('/gltf/marshall_amp_combo/output.glb');

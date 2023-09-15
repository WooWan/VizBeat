import { useGLTF } from '@react-three/drei';

export default function Model(props) {
  const { nodes, materials } = useGLTF('/gltf/speaker/scene-transformed.glb');
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.defaultMaterial.geometry} material={materials.small_speaker_1_1001} />
    </group>
  );
}

useGLTF.preload('/gltf/speaker/scene-transformed.glb');

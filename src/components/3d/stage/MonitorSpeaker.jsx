import { useGLTF } from '@react-three/drei';

export default function MonitorSpeaker(props) {
  const { nodes, materials } = useGLTF('/gltf/monitor_speaker/output.glb');
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.defaultMaterial.geometry} material={materials.floor_speaker_1001} />
    </group>
  );
}

useGLTF.preload('/gltf/monitor_speaker/output.glb');

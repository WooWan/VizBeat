import { useGLTF } from '@react-three/drei';

export default function BassAmp(props) {
  const { nodes, materials } = useGLTF('/gltf/fender_bass_amp/scene-transformed.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cab_FenderAmpCabinet_0.geometry}
        material={materials.FenderAmpCabinet}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.802, 0.587, 0.979]}
      />
      <mesh
        geometry={nodes.Head_FenderAmpHead_0.geometry}
        material={materials.FenderAmpHead}
        position={[0, 0.337, 0.028]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
        scale={0.096}
      />
    </group>
  );
}

useGLTF.preload('/gltf/fender_bass_amp/scene-transformed.glb');

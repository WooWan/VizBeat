import React, { useRef, useState, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import * as THREE from 'three';

type Props = {
  color: string;
  scale: number;
  rotation: THREE.Euler;
  position: THREE.Vector3;
};

export default function Triangle({ color, scale, rotation, position }: Props) {
  const ref = useRef<any>(null);
  const [r] = useState(() => Math.random() * 10000);
  const { paths: [path] } = useLoader(SVGLoader, '/triangle.svg') // prettier-ignore
  const geom = useMemo(() => SVGLoader.pointsToStroke(path.subPaths[0].getPoints(), path.userData?.style), []);
  return (
    <group ref={ref}>
      <mesh geometry={geom} scale={scale} rotation={rotation} position={position}>
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

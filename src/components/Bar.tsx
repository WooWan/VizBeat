import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils';
import { Mesh, Vector3 } from 'three';

type Props = {
  radius: number;
  index: number;
  centerPos: number[];
  position: Vector3;
  theta: number;
  color: string;
  meanRef: React.MutableRefObject<number>;
  dataArrayRef: React.MutableRefObject<Uint8Array | null>;
};

export default function Bar({ radius, index, centerPos, position, theta, color, meanRef, dataArrayRef }: Props) {
  const barRef = useRef<Mesh>(null!);
  const heightRef = useRef(0);
  const angleRef = useRef(theta);
  const radian = Math.PI / 180;

  useFrame((_) => {
    if (!dataArrayRef.current) return;
    const mean = meanRef.current - 1;
    const frequency = dataArrayRef.current?.[index] / 128 - 1;
    const height = heightRef.current;

    if (frequency > height) {
      heightRef.current = frequency;
    } else {
      heightRef.current = height - height * 0.2;
    }
    angleRef.current = (angleRef.current + radian) % 360;
    const power = mean < 0 ? 0 : Math.round(mean * 10000) / 10000;
    const nx = centerPos[0] + (radius + power * 500) * Math.cos(angleRef.current);
    const ny = centerPos[1] + heightRef.current * heightRef.current * 1200;
    const nz = centerPos[2] + (radius + power * 500) * Math.sin(angleRef.current);

    barRef.current.position.x = lerp(barRef.current.position.x, nx, 0.02);
    barRef.current.position.y = lerp(barRef.current.position.y, ny, 0.03);
    barRef.current.position.z = lerp(barRef.current.position.z, nz, 0.02);
  });
  return (
    <mesh ref={barRef} position={position}>
      <boxGeometry args={[0.2, 30, 0.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

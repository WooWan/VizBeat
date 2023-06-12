import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils';

type Props = {
  radius: number;
  centerPos: number[];
  mean: number;
  musicInput: number;
  position: THREE.Vector3;
  theta: number;
  color: string;
};

export default function Bar({ radius, centerPos, mean, musicInput, position, theta, color }: Props) {
  const barRef = useRef<THREE.Mesh>(null!);
  const [height, setHeight] = useState(0);
  const [angle, setAngle] = useState<any>(theta);

  const radian = Math.PI / 180;

  useFrame((_, delta) => {
    if (musicInput > height) {
      setHeight(musicInput);
    } else {
      setHeight(height - height * 0.2);
    }

    const na = (angle + radian) % 360;
    setAngle(na);
    const power = mean < 0 ? 0 : Math.round(mean * 10000) / 10000;
    const nx = centerPos[0] + (radius + power * 500) * Math.cos(angle);
    const ny = centerPos[1] + height * height * 1200;
    const nz = centerPos[2] + (radius + power * 500) * Math.sin(angle);

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

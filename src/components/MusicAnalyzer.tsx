import React, { useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Bar from './Bar';
import { useMusicPlayStore } from '@/store/music';

type Props = {
  music: React.MutableRefObject<HTMLAudioElement>;
  fftSize: number;
  centerPos: number[];
  radius: number;
};

export default function MusicAnalyzer({ music, fftSize, centerPos, radius }: Props) {
  const [analyser, setAnalyser] = useState<any>(null);
  const [dataArray, setDataArray] = useState<any>(null);
  const [mean, setMean] = useState(0);
  const [sourceNode, setSourceNode] = useState<MediaElementAudioSourceNode | null>(null);
  const isMusicPlay = useMusicPlayStore((state) => state.isMusicPlay);

  const bars = useMemo(() => {
    const bars = [];
    for (let i = 0; i < fftSize; i++) {
      const theta = (i / fftSize) * 2 * Math.PI;
      const x = centerPos[0] + radius * Math.cos(theta);
      const y = centerPos[1];
      const z = centerPos[2] + radius * Math.sin(theta);
      const hue = (i / fftSize) * 360; // Vary hue based on position in array
      const color = `hsl(${hue}, 100%, 50%)`; //
      bars.push({ position: new THREE.Vector3(x, y, z), theta: theta, color: color });
    }
    return bars;
  }, [fftSize, radius]);

  useEffect(() => {
    if (!isMusicPlay || sourceNode) return;
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(music.current);
    setSourceNode(source);
    source.connect(analyser);
    source.connect(audioContext.destination);

    analyser.fftSize = fftSize;

    setAnalyser(analyser);
  }, [isMusicPlay]);

  useFrame(() => {
    if (analyser) {
      const newData = new Uint8Array(fftSize);

      analyser.getByteTimeDomainData(newData);

      setMean(newData.reduce((a, b) => a + b) / (128 * newData.length));
      setDataArray(newData);
    }
  });
  if (isMusicPlay && dataArray) {
    return (
      <group>
        {bars.map((item, index) => (
          <Bar
            key={index}
            radius={radius}
            centerPos={centerPos}
            mean={mean - 1}
            musicInput={dataArray[index] / 128 - 1}
            position={item.position}
            theta={item.theta}
            color={item.color}
          />
        ))}
      </group>
    );
  }
  return <></>;
}

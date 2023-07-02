import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import Bar from './Bar';
import { useMusicPlayStore } from '@/store/music';
import { Vector3 } from 'three';

type Props = {
  music: React.MutableRefObject<HTMLAudioElement>;
  fftSize: number;
  centerPos: number[];
  radius: number;
};

export default function MusicAnalyzer({ music, fftSize, centerPos, radius }: Props) {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const meanRef = useRef(0);
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
      bars.push({ position: new Vector3(x, y, z), theta: theta, color: color });
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

  const newData = new Uint8Array(fftSize);
  useFrame(() => {
    if (analyser) {
      analyser.getByteTimeDomainData(newData);

      meanRef.current = newData.reduce((a, b) => a + b) / (128 * newData.length);
      dataArrayRef.current = newData;
    }
  });
  if (isMusicPlay) {
    return (
      <group>
        {bars.map((item, index) => (
          <Bar
            key={index}
            index={index}
            radius={radius}
            centerPos={centerPos}
            dataArrayRef={dataArrayRef}
            meanRef={meanRef}
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

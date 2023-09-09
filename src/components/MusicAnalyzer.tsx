import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import Bar from './Bar';
import { Vector3 } from 'three';

type Props = {
  fftSize: number;
  centerPos: number[];
  radius: number;
  audio: HTMLAudioElement;
};

type AudioNode = {
  sourceNode: MediaElementAudioSourceNode;
  analyzerNode: AnalyserNode;
};

export default function MusicAnalyzer({ fftSize, centerPos, radius, audio }: Props) {
  const [audioMap, setAudioMap] = useState({} as AudioNode);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const meanRef = useRef(0);
  const newData = useMemo(() => new Uint8Array(fftSize), [fftSize]);

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
    if (audioMap.sourceNode) return;

    const audioContext = new AudioContext();
    const soureNode = audioContext.createMediaElementSource(audio);
    const analyzerNode = audioContext.createAnalyser();

    soureNode?.connect(analyzerNode);
    soureNode?.connect(audioContext.destination);
    analyzerNode.fftSize = fftSize;

    setAudioMap({
      sourceNode: soureNode,
      analyzerNode: analyzerNode
    });

    return () => {
      audioContext.close();
      soureNode?.disconnect();
      analyzerNode?.disconnect();
    };
  }, []);

  useFrame(() => {
    const analyzerNode = audioMap.analyzerNode;
    if (!analyzerNode) return;

    analyzerNode.getByteTimeDomainData(newData);
    meanRef.current = newData.reduce((a, b) => a + b / newData.length);
    dataArrayRef.current = newData;
  });

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

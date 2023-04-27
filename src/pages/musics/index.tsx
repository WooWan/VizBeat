import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import Music from '@/components/Music';
import { create } from 'zustand';

const titleList = [
  'Complicated',
  'Self Control',
  'Get Lucky',
  "Sweet Childs O'mine",
  'Smells like Teen Sprit',
  'Marigold',
  'Billie Bossa Nova',
  'How Like That',
  'Canonball',
  'Humble',
  'Hype Boy',
  'Take Where Your Heart is'
];

const list = [
  '/album/avril.png',
  '/album/blonde.jpeg',
  '/album/daft.jpeg',
  '/album/guns.jpeg',
  '/album/nevermind.jpg.webp',
  '/album/aimyon.jpeg',
  '/album/billie.webp',
  '/album/blackpink.jpeg',
  '/album/breeders.jpeg',
  '/album/damn.jpeg',
  '/album/newjeans.webp',
  '/album/Q.jpeg'
];

const Index = () => {
  const [selectedIdx, setSelectedIdx] = useState<null | number>(null);
  const [previousIdx, setPreviousIdx] = useState<null | number>(null);
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleClick = (idx: number) => {
    if (selectedIdx == null) {
      setSelectedIdx(idx);
    } else {
      setPreviousIdx(selectedIdx);
      setSelectedIdx(null);
    }
    scrollToItem(idx);
  };

  const scrollToItem = (index: number) => {
    const target = index === 0 ? 0 : index - 1;
    if (listRefs.current[target]) {
      listRefs.current[target]?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className={'grid grid-cols-[400px_minmax(900px,_1fr)] h-screen'}>
      <div className={'bg-white bg-opacity-90 px-6'}>
        <h1>Music Title</h1>
        <img src="/album/aimyon.jpeg" />
        Selected Music : <audio id="vocal" controls src=""></audio>
        <br />
        <span>My List</span>
        <ul
          className={
            'overflow-y-scroll h-32 snap-y snap-mandatory bg-black bg-opacity-90 py-4 flex flex-col items-center  scrollbar scrollbar-thumb-red-400'
          }
        >
          {list.map((title, index) => (
            <li
              key={index}
              className={
                'py-2 border-y-[1px] border-y-amber-50 w-[250px] flex justify-center cursor-pointer snap-center text-white'
              }
              ref={(el) => (listRefs.current[index] = el)}
              onClick={() => handleClick(index)}
            >
              {title}
            </li>
          ))}
        </ul>
        <button>+ add</button>
      </div>
      <Canvas
        camera={{
          zoom: 2.7,
          position: [15, 5, 0],
          fov: 100,
          near: 0.1,
          far: 1000
        }}
      >
        <color attach="background" args={['white']} />
        <ScrollControls enabled={selectedIdx === null}>
          {list.map((url, i) => (
            <Music
              key={i}
              url={url}
              index={i}
              // scrollToItem={scrollToItem}
              handleClick={handleClick}
              previousIdx={previousIdx}
              setPreviousIdx={setPreviousIdx}
              selectedIdx={selectedIdx}
            />
          ))}
        </ScrollControls>
        <ambientLight />
      </Canvas>
    </div>
  );
};

export default Index;

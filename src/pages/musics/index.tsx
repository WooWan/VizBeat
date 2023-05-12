import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import MusicList from '@/components/MusicList';

const musicList = [
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
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleClick = (idx: number) => {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
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
          {musicList.map((title, index) => (
            <li
              key={index}
              className={
                'py-2 border-y-[1px] border-y-amber-50 w-[250px] flex justify-center cursor-pointer snap-center text-white'
              }
              ref={(el) => (listRefs.current[index] = el)}
              onClick={() => handleClick(index)}
            >
              {title.split('/')[2].split('.')[0]}
            </li>
          ))}
        </ul>
        <button>+ add</button>
      </div>
      <Canvas
        className="scrollbar scrollbar-thumb-red-400 h-32"
        camera={{
          zoom: 1.7,
          position: [15, 5, 0],
          fov: 100,
          near: 0.1,
          far: 1000
        }}
      >
        <color attach="background" args={['white']} />
        {/* style for hide scroll bar */}
        <ScrollControls damping={0} style={{ left: '15px' }}>
          <MusicList
            handleClick={handleClick}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx}
            musicList={musicList}
          />
        </ScrollControls>
        <ambientLight />
      </Canvas>
    </div>
  );
};

export default Index;

import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import MusicList from '@/components/MusicList';
import { useMusics } from '@/hooks/queries/music/useMusics';
import Image from 'next/image';
import { Music } from '@prisma/client';

const MusicsPage = () => {
  const { data: musics, isLoading, isError } = useMusics();
  const [selectedIdx, setSelectedIdx] = useState<null | number>(null);
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  const handleClick = (idx: number) => {
    if (!musics) return;
    setSelectedMusic(musics[idx]);
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

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <div className={'grid grid-cols-[400px_minmax(900px,_1fr)] h-screen'}>
      <div className={'bg-white bg-opacity-90 px-6'}>
        <h1>Music Title</h1>
        <Image
          src={selectedMusic ? selectedMusic.albumCover : '/images/vinyl_record.png'}
          alt={'album'}
          width={250}
          height={250}
        />
        Selected Music : <audio id="vocal" controls src={selectedMusic?.musicLink}></audio>
        <br />
        <span>My List</span>
        <ul
          className={
            'overflow-y-scroll h-32 snap-y snap-mandatory bg-black bg-opacity-90 py-4 flex flex-col items-center  scrollbar scrollbar-thumb-red-400'
          }
        >
          {musics?.map((music, index) => (
            <li
              key={index}
              className={
                'py-2 border-y-[1px] border-y-amber-50 w-[250px] flex justify-center cursor-pointer snap-center text-white'
              }
              ref={(el) => (listRefs.current[index] = el)}
              onClick={() => handleClick(index)}
            >
              {music.title}
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
            musicList={musics}
          />
        </ScrollControls>
        <ambientLight />
      </Canvas>
    </div>
  );
};

export default MusicsPage;

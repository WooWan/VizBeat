import React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { useMusicPlayStore } from '@/store/music';
import { PauseIcon, PlayIcon } from 'lucide-react';

const MusicPlayToggleButton = () => {
  const { isMusicPlay, setIsMusicPlay } = useMusicPlayStore();

  const transitions = useTransition(isMusicPlay, {
    initial: {
      transform: 'scale(1) rotate(0deg)',
      opacity: 1
    },
    from: {
      transform: 'scale(0) rotate(-180deg)',
      opacity: 0
    },
    enter: {
      transform: 'scale(1) rotate(0deg)',
      opacity: 1
    },
    leave: {
      transform: 'scale(0) rotate(180deg)',
      opacity: 0
    },

    reverse: true
  });

  return (
    <button
      className={
        'group fixed right-5 top-4 z-50 mr-1 h-10 w-10 cursor-pointer rounded-full text-white hover:bg-white/[0.5]'
      }
      onClick={() => setIsMusicPlay(!isMusicPlay)}
    >
      {transitions((style, isPlay) => (
        <div className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}>
          <animated.div style={style} className={'block text-white/[0.9] group-hover:text-black'}>
            {isPlay ? <PauseIcon /> : <PlayIcon />}
          </animated.div>
        </div>
      ))}
    </button>
  );
};

export default MusicPlayToggleButton;

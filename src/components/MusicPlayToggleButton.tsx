import { animated, useTransition } from '@react-spring/web';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music';

const MusicPlayToggleButton = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const isMusicPlay = useMusicStore((state) => state.isAudioPlaying);
  const playMusic = useMusicStore((state) => state.api.playAudio);

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
      className={cn('group z-50 h-9 w-9 cursor-pointer rounded-full text-white hover:bg-white/[0.5]', className)}
      onClick={playMusic}
      {...props}
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

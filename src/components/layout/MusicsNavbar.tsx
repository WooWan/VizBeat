import React, { useRef } from 'react';
import AudioPlayer from '@/components/audio-player/AudioPlayer';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music';
import { shallow } from 'zustand/shallow';
import { useDeleteMusic, useMusics } from '@/hooks/queries/music/useMusics';
import MusicUploadModal from '@/components/modal/MusicUploadModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { Music } from '@prisma/client';
import { defaultUserId } from '@/utils/password';

const MusicsNavbar = () => {
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);
  const { data: musics } = useMusics();
  const router = useRouter();
  const deleteSelectedMusic = useDeleteMusic();
  const { api, musicInfo } = useMusicStore(
    (state) => ({
      musicInfo: state.musicInfo,
      api: state.api
    }),
    shallow
  );
  const selectedMusic = musics?.find((music) => music.id === musicInfo?.id);

  const redirectToStage = () => {
    api.stopAudio();
    router.push(`/stage/${musicInfo?.id}`);
    api.clear();
  };

  const selectAlbum = (music: Music) => {
    api.selectAudio(music);
    router.prefetch(`/stage/${music.id}`);
  };

  const deleteMusic = async (selectedMusic: Music) => {
    deleteSelectedMusic.mutate(selectedMusic);
    api.clear();
  };

  return (
    <nav className={'hidden flex-col bg-white bg-opacity-90 px-6 lg:flex'}>
      <Link href="/">
        <h2 className={'pt-3 text-xl font-semibold'}>Vizbeat</h2>
      </Link>
      <AudioPlayer musics={musics} />
      <ul
        className={
          'flex max-h-[160px] snap-y snap-mandatory flex-col items-center overflow-y-scroll bg-white bg-opacity-90 py-4 scrollbar-thin scrollbar-thumb-gray-900'
        }
      >
        {musics?.map((music, index) => (
          <li
            key={index}
            className={cn(
              'flex w-full cursor-pointer snap-center items-center justify-between border-b-[1px] border-y-slate-700 px-4 py-2 hover:bg-slate-100',
              {
                'bg-slate-100': musicInfo === music
              }
            )}
            ref={(el) => (listRefs.current[index] = el)}
            onClick={() => selectAlbum(music)}
          >
            <span className="flex items-center">
              {music.title}
              {!music.vocalUrl && <Loader2Icon className="ml-1.5 h-4 w-4 animate-spin" />}
            </span>
            <span className="text-sm">{music.artist}</span>
          </li>
        ))}
      </ul>
      <MusicUploadModal />
      {selectedMusic?.vocalUrl && (
        <section className="flex justify-center gap-x-2 pt-2">
          {selectedMusic?.userId === defaultUserId && (
            <Button className="w-full" onClick={() => deleteMusic(selectedMusic)}>
              Delete
            </Button>
          )}
          <Button className="w-full" onClick={redirectToStage}>
            Go to Stage
          </Button>
        </section>
      )}
    </nav>
  );
};

export default MusicsNavbar;

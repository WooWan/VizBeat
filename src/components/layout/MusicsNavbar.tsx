import React, { useEffect, useRef, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { Music } from '@prisma/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Dropzone from '@/components/Dropzone';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import MusicUploadForm from '../form/MusicUploadForm';
import { XIcon } from 'lucide-react';
import { useMusicStore } from '@/store/music';
import { shallow } from 'zustand/shallow';
import { MusicUpload } from '@/types/spotify';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchMusicFromSpotify } from '@/service/musics';
import { useMusics } from '@/hooks/queries/music/useMusics';

const MusicsNavbar = () => {
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [musicKeyword, setMusicKeyword] = useState('');
  const debouncedKeyword = useDebounce(musicKeyword, 250);
  const { data } = useQuery({
    queryKey: ['spotify-music', debouncedKeyword],
    queryFn: () => fetchMusicFromSpotify(debouncedKeyword),
    enabled: debouncedKeyword !== '',
    retry: 1
  });
  const { data: musics } = useMusics();
  const [selectedTrack, setSelectedTrack] = useState<MusicUpload>();
  const [imagePreview, setImagePreview] = useState('');
  const { api, musicInfo } = useMusicStore(
    (state) => ({
      musicInfo: state.musicInfo,
      api: state.api
    }),
    shallow
  );

  const handleSearchMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicKeyword(e.target.value);
  };

  return (
    <nav className={'hidden flex-col bg-white bg-opacity-90 px-6 lg:flex'}>
      <h2 className={'pt-2 text-h1'}>Music</h2>
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
              'grid w-full cursor-pointer snap-center grid-cols-[200px_1fr] border-b-[1px] border-y-slate-700 px-4 py-2 hover:bg-slate-100',
              {
                'bg-slate-100': musicInfo === music
              }
            )}
            ref={(el) => (listRefs.current[index] = el)}
            onClick={() => api.selectAudio(music)}
          >
            <span>{music.artist}</span>
            <span>{music.title}</span>
          </li>
        ))}
      </ul>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">음악 추가하기</Button>
        </DialogTrigger>
        <DialogContent
          className={cn('flex max-h-[320px] flex-col overflow-auto transition-all duration-[1500ms] sm:max-w-[425px]', {
            'max-h-[820px]': selectedTrack || musicKeyword
          })}
        >
          <DialogHeader className="pb-3">
            <DialogTitle>Upload your music 🎸</DialogTitle>
          </DialogHeader>
          {!selectedTrack && (
            <>
              <Dropzone setImagePreview={setImagePreview} setSelectedTrack={setSelectedTrack} />
              <div className="mt-6 border-t-[1px] border-gray-200 text-center">
                <span className="inline-block -translate-y-3 bg-white px-2 text-gray-400">OR</span>
              </div>
            </>
          )}
          <section>
            <Input
              type="text"
              placeholder="Search Music"
              onChange={handleSearchMusic}
              className="mb-3 rounded-lg bg-gray-100 p-1.5 placeholder:text-gray-400"
            />
            <ul className="flex max-h-[150px] flex-col overflow-auto">
              {data?.tracks.items.map((track) => (
                <li
                  key={track.id}
                  onClick={() => {
                    setSelectedTrack({
                      id: track.id,
                      title: track.name,
                      artist: track.artists[0].name,
                      albumCover: track.album.images[0].url,
                      url: track.external_urls.spotify
                    });
                    setImagePreview(track.album.images[0].url);
                  }}
                  className={cn('flex gap-x-3.5 rounded-sm border-b-[1px] py-3 pl-3 hover:bg-gray-200', {
                    'bg-gray-200': selectedTrack?.id === track.id
                  })}
                >
                  <Image
                    className="rounded-md"
                    src={encodeURI(track.album.images[0].url)}
                    width={50}
                    height={50}
                    alt="album-cover"
                  />
                  <div>
                    <h5 className="text-md font-semibold">{track.artists[0].name}</h5>
                    <span>{track.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          {selectedTrack && (
            <section className="px-3">
              <div className="relative mt-4 flex items-center justify-center">
                <XIcon
                  className="absolute -top-2 right-0 z-10 h-5 w-5 cursor-pointer text-gray-400"
                  onClick={() => setSelectedTrack(undefined)}
                />
                <div className="h-52 w-52">
                  <Image
                    fill
                    className={'justify-self-center rounded-md object-contain'}
                    src={imagePreview}
                    alt={'cover'}
                  />
                </div>
              </div>
              <MusicUploadForm selectedTrack={selectedTrack} />
            </section>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default MusicsNavbar;

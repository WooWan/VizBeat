import React, { useEffect, useRef, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { Music } from '@prisma/client';
import clsx from 'clsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Dropzone from '@/components/Dropzone';
import * as musicMetadata from 'music-metadata-browser';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useQuery } from '@tanstack/react-query';
import { Spotify } from '@/types/spotify';
import { useDebounce } from '@/hooks/useDebounce';
import { spotifyClient } from '@/service/httpClient';

const formSchema = z.object({
  title: z.string().min(1).max(50),
  artist: z.string().min(1).max(50)
});

type Props = {
  musics?: Music[];
  selectedMusic: Music | null;
  setSelectedMusic: React.Dispatch<React.SetStateAction<Music | null>>;
  handleMusicSelect: (id: string) => void;
};

export type MusicEssential = Pick<Music, 'title' | 'artist' | 'albumCover'>;
export interface AudioFile extends File {
  path: string;
}

const fetchMusicFromSpotify = async (musicKeyword: string): Promise<Spotify> => {
  const res = await spotifyClient().get('/search', {
    params: {
      q: musicKeyword,
      type: 'track',
      limit: 2
    }
  });
  return res.data;
};

const MusicsNavbar = ({ selectedMusic, setSelectedMusic, musics, handleMusicSelect }: Props) => {
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [musicKeyword, setMusicKeyword] = useState<string>('');
  const debouncedKeyword = useDebounce(musicKeyword, 250);
  const { data } = useQuery({
    queryKey: ['spotify-music', musicKeyword],
    queryFn: () => fetchMusicFromSpotify(musicKeyword),
    enabled: !!debouncedKeyword,
    retry: 1
  });
  const [selectedTrack, setSelectedTrack] = useState<MusicEssential | undefined>(undefined);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      artist: ''
    }
  });
  const hasSelectMusic = form.formState.isDirty || selectedTrack;

  const skipToNextMusic = () => {
    if (!musics) return;
    const index = musics.findIndex((music) => music.id === selectedMusic?.id);
    const nextIndex = index === musics.length - 1 ? 0 : index + 1;
    setSelectedMusic(musics[nextIndex]);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const onDropMusicFile = (acceptedFiles: File[]) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const audio = await musicMetadata.parseBlob(file);
        setSelectedTrack({
          title: audio.common.title || '',
          artist: audio.common.artist || '',
          albumCover: URL.createObjectURL(
            new Blob([audio.common.picture?.[0].data || ''], {
              type: audio.common.picture?.[0].format
            })
          )
        });
      };
      setAudioFile(file as AudioFile);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSearchMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicKeyword(e.target.value);
  };

  useEffect(() => {
    if (!selectedTrack) return;
    form.setValue('title', selectedTrack?.title, {
      shouldDirty: true
    });
    form.setValue('artist', selectedTrack?.artist);
  }, [selectedTrack]);

  return (
    <nav className={'hidden flex-col bg-white bg-opacity-90 px-6 lg:flex'}>
      <h2 className={'pt-2 text-h1'}>Music</h2>
      <AudioPlayer selectedMusic={selectedMusic} skipNextMusic={skipToNextMusic} />
      <ul
        className={
          'flex max-h-[160px] snap-y snap-mandatory flex-col items-center overflow-y-scroll bg-white bg-opacity-90 py-4 scrollbar-thin scrollbar-thumb-gray-900'
        }
      >
        {musics?.map((music, index) => {
          return (
            <li
              key={index}
              className={clsx(
                'grid w-full cursor-pointer snap-center grid-cols-[200px_1fr] border-b-[1px] border-y-slate-700 px-4 py-2 hover:bg-slate-100',
                {
                  'bg-slate-100': selectedMusic === music
                }
              )}
              ref={(el) => (listRefs.current[index] = el)}
              onClick={() => handleMusicSelect(music.id)}
            >
              <span>{music.artist}</span>
              <span>{music.title}</span>
            </li>
          );
        })}
      </ul>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">음악 추가하기</Button>
        </DialogTrigger>
        <DialogContent
          className={cn('max-h-[300px] overflow-auto transition-all duration-700 sm:max-w-[425px]', {
            'max-h-[820px]': hasSelectMusic
          })}
        >
          <DialogHeader>
            <DialogTitle>음악을 업로드 해보세요 🎸</DialogTitle>
          </DialogHeader>
          <section>
            <h3>음악을 검색해보세요</h3>
            <input type="text" onChange={handleSearchMusic} className="rounded-lg bg-gray-100 p-2" />
            <ul className="flex flex-col gap-y-3 px-1 py-4">
              {data?.tracks.tracks.map((track) => {
                return (
                  <li
                    key={track.id}
                    onClick={() =>
                      setSelectedTrack({
                        title: track.name,
                        artist: track.artists[0].name,
                        albumCover: track.album.images[0].url
                      })
                    }
                    className={cn('flex gap-x-3 rounded-lg py-3 pl-3', {
                      'bg-gray-100': selectedTrack?.title === track.name
                    })}
                  >
                    <Image src={track.album.images[0].url} width={50} height={50} alt="album-cover" />
                    <div>
                      <h5 className="text-md font-semibold">{track.artists[0].name}</h5>
                      <span>{track.name}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          {hasSelectMusic ? (
            <Image
              src={selectedTrack?.albumCover || ''}
              className={'justify-self-center'}
              alt={'album'}
              height={250}
              width={250}
            />
          ) : (
            <Dropzone onDropMusicFile={onDropMusicFile} />
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn('hidden', {
                block: hasSelectMusic
              })}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Music</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>artist</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default MusicsNavbar;

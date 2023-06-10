import React, { useRef, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { Music } from '@prisma/client';
import clsx from 'clsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Dropzone from '@/components/Dropzone';
import * as musicMetadata from 'music-metadata-browser';
import { IAudioMetadata } from 'music-metadata-browser';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import axios from 'axios';

const formSchema = z.object({
  music: z.string().min(1).max(50),
  artist: z.string().min(1).max(50),
  album: z.string().min(1).max(50),
  genre: z.string().min(1).max(20)
});

type Props = {
  musics: Music[];
  selectedMusic: Music | null;
  setSelectedMusic: React.Dispatch<React.SetStateAction<Music | null>>;
  handleMusicSelect: (id: string) => void;
};

export interface AudioFile extends File {
  path: string;
}

const MusicsNavbar = ({ selectedMusic, setSelectedMusic, musics, handleMusicSelect }: Props) => {
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<IAudioMetadata | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  const skipToNextMusic = () => {
    if (!musics) return;
    const index = musics.findIndex((music) => music.id === selectedMusic?.id);
    const nextIndex = index === musics.length - 1 ? 0 : index + 1;
    setSelectedMusic(musics[nextIndex]);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(audioFile);
    console.log(audioMetadata);
    console.log('data', data);
    await axios.post('/api/music', {
      ...audioFile,
      ...audioMetadata,
      ...data
    });
  };

  const onDropMusicFile = (acceptedFiles: File[]) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const audio = await musicMetadata.parseBlob(file);
        form.setValue('music', audio.common.title || '', {
          shouldDirty: true
        });
        form.setValue('artist', audio.common.artist || '');
        form.setValue('album', audio.common.album || '');
        form.setValue('genre', audio.common.genre?.join(', ') || '');
        setAudioMetadata(audio);
      };
      setAudioFile(file as AudioFile);
      reader.readAsArrayBuffer(file);
    });
  };

  const splitMusic = async () => {
    const moises_url = 'https://developer-api.moises.ai/api/job';
    const res = await axios.post(
      moises_url,
      {
        name: 'google_drive',
        workflow: 'moises/stems-vocals-accompaniment',
        params: {
          inputUrl: 'https://drive.google.com/uc?id=1fzk3VWZ1MmwljyD3clRi-EAW7jO9IliM&authuser=0&export=download'
          // inputUrl: 'https://sgfbjtwrqhjzbyuhnknq.supabase.co/storage/v1/object/public/music/music/green_day'
          // inputUrl: data.publicUrl
          // inputUrl: 'https://www.dropbox.com/s/n041ztnvb47o0pc/Basket%20Case-7-Green%20Day.mp3?dl=1'
          // 'https://sgfbjtwrqhjzbyuhnknq.supabase.co/storage/v1/object/public/music/music/night_dancer?download='
          // 'https://sgfbjtwrqhjzbyuhnknq.supabase.co/storage/v1/object/public/music/music/night_dancer?t=2023-05-29T06%3A36%3A52.366Z?download='
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'fb0bcedf-09dd-4c70-9df8-0282a7428843'
        }
      }
    );
  };

  return (
    <nav className={'flex flex-col bg-white bg-opacity-90 px-6'}>
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
          className={cn('max-h-[300px] overflow-hidden transition-all duration-700 sm:max-w-[425px]', {
            'max-h-[820px]': form.formState.isDirty
          })}
        >
          <DialogHeader>
            <DialogTitle>음악을 업로드 해보세요 🎸</DialogTitle>
          </DialogHeader>
          {audioMetadata?.common.picture ? (
            <Image
              src={URL.createObjectURL(
                new Blob([audioMetadata.common.picture[0].data], {
                  type: audioMetadata.common.picture[0].format
                })
              )}
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
                block: form.formState.isDirty
              })}
            >
              <FormField
                control={form.control}
                name="music"
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
              <FormField
                control={form.control}
                name="album"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>album</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>genre</FormLabel>
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

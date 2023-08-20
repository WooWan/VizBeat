import React, { useEffect, useRef, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { Music } from '@prisma/client';
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
import { MusicUpload } from '@/types/spotify';
import { useDebounce } from '@/hooks/useDebounce';
import { httpClient } from '@/service/httpClient';
import { isUploadWithFile, isUploadWithSpotify } from '@/utils/typeGuards';
import { fetchMusicFromSpotify } from '@/service/musics';
import { useSeparateMusic } from '@/hooks/queries/music/useMusics';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  title: z.string().min(1).max(50),
  artist: z.string().min(1).max(50)
});

type Props = {
  musics?: Music[];
  selectedMusic: Music | null;
  handleMusicSelect: (id: string) => void;
};

const MusicsNavbar = ({ selectedMusic, musics, handleMusicSelect }: Props) => {
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [musicKeyword, setMusicKeyword] = useState<string>('');
  const debouncedKeyword = useDebounce(musicKeyword, 250);
  const { data } = useQuery({
    queryKey: ['spotify-music', debouncedKeyword],
    queryFn: () => fetchMusicFromSpotify(debouncedKeyword),
    enabled: debouncedKeyword !== '',
    retry: 1
  });
  const [selectedTrack, setSelectedTrack] = useState<MusicUpload>();
  const [imagePreview, setImagePreview] = useState('');
  const separateMusic = useSeparateMusic();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      artist: ''
    }
  });
  const hasSelectMusic = form.formState.isDirty || selectedTrack;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!selectedTrack) return;

    if (isUploadWithFile(selectedTrack)) {
      const formData = new FormData();
      formData.append('audio', selectedTrack.audioFile);
      formData.append('albumCover', selectedTrack?.albumCover);
      formData.append('title', data.title);
      formData.append('artist', data.artist);

      separateMusic.mutate(formData);
    } else if (isUploadWithSpotify(selectedTrack)) {
      await httpClient.post('/music', selectedTrack);
    }
  };

  const onDropMusicFile = (acceptedFiles: File[]) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const audio = await musicMetadata.parseBlob(file);
        setSelectedTrack({
          id: uuidv4(),
          title: audio.common.title || '',
          artist: audio.common.artist || '',
          albumCover: new Blob([audio.common.picture?.[0].data || '']),
          audioFile: file
        });
        setImagePreview(
          URL.createObjectURL(
            new Blob([audio.common.picture?.[0].data || ''], {
              type: audio.common.picture?.[0].format
            })
          )
        );
      };
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
      <AudioPlayer musics={musics} selectedMusic={selectedMusic} handleMusicSelect={handleMusicSelect} />
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
                'bg-slate-100': selectedMusic === music
              }
            )}
            ref={(el) => (listRefs.current[index] = el)}
            onClick={() => handleMusicSelect(music.id)}
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
            'max-h-[820px]': hasSelectMusic || musicKeyword
          })}
        >
          <DialogHeader className="pb-3">
            <DialogTitle>Upload your music 🎸</DialogTitle>
          </DialogHeader>
          {!hasSelectMusic && (
            <>
              <Dropzone onDropMusicFile={onDropMusicFile} />
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
          {hasSelectMusic && (
            <Image
              src={imagePreview}
              className={'mt-3 justify-self-center rounded-md'}
              alt={'album'}
              height={250}
              width={250}
            />
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn('hidden pt-3', {
                block: hasSelectMusic
              })}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-2">
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
                    <FormLabel>Artist</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <footer className="flex justify-end pt-4">
                <Button type="submit">Submit</Button>
              </footer>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default MusicsNavbar;

import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import Dropzone from '@/components/Dropzone';
import { useMusicSearch } from '@/hooks/queries/music/useMusics';
import { MusicUpload } from '@/types/spotify';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import MusicUploadForm from '@/components/form/MusicUploadForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function MusicUploadModal() {
  const [musicKeyword, setMusicKeyword] = useState('');
  const debouncedKeyword = useDebounce(musicKeyword, 250);
  const { data } = useMusicSearch(debouncedKeyword);
  const [selectedTrack, setSelectedTrack] = useState<MusicUpload>();
  const [imagePreview, setImagePreview] = useState('');

  const handleSearchMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicKeyword(e.target.value);
  };

  return (
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
          <ul className="flex max-h-[150px] flex-col overflow-auto border-b-[1px] border-zinc-300">
            {data?.map((track) => (
              <li
                key={track.id}
                onClick={() => {
                  setSelectedTrack({
                    id: track.id,
                    title: track.parsed_title,
                    artist: track.parsed_artist,
                    url: track.thumbnail
                  });
                  setImagePreview(track.thumbnail);
                }}
                className={cn('flex gap-x-3.5 rounded-sm border-b-[1px] py-3 pl-3 hover:bg-gray-200', {
                  'bg-gray-200': selectedTrack?.id === track.id
                })}
              >
                <Image
                  className="rounded-md object-contain"
                  width={50}
                  height={50}
                  src={track.thumbnail}
                  alt="album-cover"
                />
                <div>
                  <h5 className="text-md font-semibold">{track.parsed_artist}</h5>
                  <span>{track.parsed_title}</span>
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
              <Image
                width={150}
                height={100}
                className={'justify-self-center rounded-md object-contain'}
                src={imagePreview}
                alt={'vidoe-thumbnail'}
              />
            </div>
            <MusicUploadForm selectedTrack={selectedTrack} />
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MusicUploadModal;

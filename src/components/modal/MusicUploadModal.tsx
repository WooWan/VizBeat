import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import Dropzone from '@/components/dropzone/Dropzone';
import { MusicUpload, YoutubeMusic } from '@/types/music';
import Image from 'next/image';
import MusicUploadForm from '@/components/form/MusicUploadForm';
import { Button } from '@/components/ui/button';
import MusicSearch from '@/components/MusicSearch';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';

function MusicUploadModal() {
  const [selectedTrack, setSelectedTrack] = useState<MusicUpload>();
  const [imagePreview, setImagePreview] = useState('');

  const [musicKeyword, setMusicKeyword] = useState('');
  const debouncedKeyword = useDebounce(musicKeyword, 200);

  const handleSearchMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicKeyword(e.target.value);
  };

  const updateSelectedTrack = (track: YoutubeMusic) => {
    setSelectedTrack({
      id: track.id,
      title: track.parsed_title,
      artist: track.parsed_artist,
      albumCover: track.thumbnail
    });
    setImagePreview(track.thumbnail);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">음악 추가하기</Button>
      </DialogTrigger>
      <DialogContent
        className={cn('duration-[1500ms] flex max-h-[320px] flex-col overflow-auto transition-all sm:max-w-[425px]', {
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
          <MusicSearch
            updateSelectedTrack={updateSelectedTrack}
            selectedTrack={selectedTrack}
            keyword={debouncedKeyword}
          />
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
                alt={'video-thumbnail'}
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

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

function MusicUploadModal() {
  const [selectedTrack, setSelectedTrack] = useState<MusicUpload>();
  const [imagePreview, setImagePreview] = useState('');
  const [open, setOpen] = useState(false);

  const updateSelectedTrack = (track: YoutubeMusic) => {
    setSelectedTrack({
      id: track.id,
      title: track.parsed_title,
      artist: track.parsed_artist,
      albumCover: track.thumbnail
    });
    setImagePreview(track.thumbnail);
  };

  const closeModal = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mb-2 flex min-h-[40px] items-center rounded-md bg-red-100 px-4 py-1 text-center align-middle">
        <span className="text-sm text-red-700">AI 서버 비용으로 음원 업로드를 막아두었습니다.</span>
      </div>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled>
          음악 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn('duration-[2500ms] flex max-h-[820px] flex-col overflow-auto transition-all sm:max-w-[425px]')}
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
        <MusicSearch updateSelectedTrack={updateSelectedTrack} selectedTrack={selectedTrack} />
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
            <MusicUploadForm selectedTrack={selectedTrack} closeModal={closeModal} />
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MusicUploadModal;

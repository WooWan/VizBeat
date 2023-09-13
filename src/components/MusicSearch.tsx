import Image from 'next/image';
import { useMusicSearch } from '@/hooks/queries/music/useMusics';
import { cn } from '@/lib/utils';
import { MusicUpload, YoutubeMusic } from '@/types/music';
import { RefreshCwIcon, XIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Suspense, useState } from 'react';
import { Input } from '@/components/ui/input';

type Props = {
  updateSelectedTrack: (track: YoutubeMusic) => void;
  selectedTrack?: MusicUpload;
};

function MusicSearch({ updateSelectedTrack, selectedTrack }: Props) {
  const [musicKeyword, setMusicKeyword] = useState('');
  const debouncedKeyword = useDebounce(musicKeyword, 200);
  const { data, isError, refetch } = useMusicSearch(debouncedKeyword);

  const handleSearchMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicKeyword(e.target.value);
  };

  return (
    <section>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search Music"
          value={musicKeyword}
          onChange={handleSearchMusic}
          className="mb-3 rounded-lg bg-gray-100 p-1.5 placeholder:text-gray-400"
        />
        {musicKeyword && (
          <button className="absolute right-4 top-3" onClick={() => setMusicKeyword('')}>
            <XIcon className="h-4 w-4 text-zinc-500" />
          </button>
        )}
      </div>
        <ul
          className={cn('flex max-h-[175px] flex-col overflow-y-scroll  border-zinc-300', {
            'border-b-[1px]': data?.length
          })}
        >
          {data?.map((track) => (
            <li
              key={track.id}
              onClick={() => updateSelectedTrack(track)}
              className={cn('flex h-[70px] gap-x-3.5 rounded-sm border-b-[1px] py-3 pl-3 hover:bg-gray-200', {
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
              <div className="break-keep">
                <h5 className="text-sm font-semibold">{track.parsed_artist}</h5>
                <span className="line-clamp-1 text-sm">{track.parsed_title}</span>
              </div>
            </li>
          ))}
        </ul>
      {isError && (
        <div className="relative flex h-20 w-full items-center justify-center gap-x-1 rounded-md bg-gray-100/[0.75]">
          <span className="text-gray-400">No results</span>
          <button type="button" onClick={() => refetch()}>
            <RefreshCwIcon className="h-4 w-4  text-gray-400" />
          </button>
        </div>
      )}
    </section>
  );
}

export default MusicSearch;

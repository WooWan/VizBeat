import Image from 'next/image';
import { useMusicSearch } from '@/hooks/queries/music/useMusics';
import { cn } from '@/lib/utils';
import { MusicUpload, YoutubeMusic } from '@/types/music';
import { XIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchFallback } from '@/components/error-boundary/fallback/SearchFallback';
import ApiErrorBoundary from '@/components/error-boundary/ApiBoundary';

type Props = {
  updateSelectedTrack: (track: YoutubeMusic) => void;
  selectedTrack?: MusicUpload;
};

function MusicSearch({ updateSelectedTrack, selectedTrack }: Props) {
  const [musicKeyword, setMusicKeyword] = useState('');
  const debouncedKeyword = useDebounce(musicKeyword, 200);

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
      <ApiErrorBoundary renderFallback={SearchFallback} resetKeys={[debouncedKeyword]}>
        <MusicList updateSelectedTrack={updateSelectedTrack} selectedTrack={selectedTrack} keyword={debouncedKeyword} />
      </ApiErrorBoundary>
    </section>
  );
}

type MusicSearchProps = Props & {
  keyword: string;
};

function MusicList({ updateSelectedTrack, selectedTrack, keyword }: MusicSearchProps) {
  const { data } = useMusicSearch(keyword);

  return (
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
          <Image className="rounded-md object-contain" width={50} height={50} src={track.thumbnail} alt="album-cover" />
          <div className="break-keep">
            <h5 className="text-sm font-semibold">{track.parsed_artist}</h5>
            <span className="line-clamp-1 text-sm">{track.parsed_title}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MusicSearch;

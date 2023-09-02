import Image from 'next/image';
import { useMusicSearch } from '@/hooks/queries/music/useMusics';
import { cn } from '@/lib/utils';
import { MusicUpload, YoutubeMusic } from '@/types/music';
import { RefreshCwIcon } from 'lucide-react';

type Props = {
  updateSelectedTrack: (track: YoutubeMusic) => void;
  selectedTrack?: MusicUpload;
  keyword: string;
};

function MusicSearch({ updateSelectedTrack, selectedTrack, keyword }: Props) {
  const { data, isError, refetch } = useMusicSearch(keyword);

  if (data) {
    return (
      <ul className="flex h-[175px] flex-col overflow-auto border-b-[1px] border-zinc-300">
        {data?.map((track) => (
          <li
            key={track.id}
            onClick={() => updateSelectedTrack(track)}
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
            <div className="break-keep">
              <h5 className="text-sm font-semibold">{track.parsed_artist}</h5>
              <span className="text-sm">{track.parsed_title}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="relative flex h-20 w-full items-center justify-center gap-x-1 rounded-md bg-gray-100/[0.75]">
        <span className="text-gray-400">No results</span>
        <button type="button" onClick={() => refetch()}>
          <RefreshCwIcon className="h-4 w-4  text-gray-400" />
        </button>
      </div>
    );
  }

  return <></>;
}

export default MusicSearch;

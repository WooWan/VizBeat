import AudioMergeTooltip from '@/components/AudioMergeTooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { audioTracks } from '@/constants/music';
import { useClickAway } from '@/hooks/useOutsideClick';
import { useMusicStore } from '@/store/music';
import { AudioTracks } from '@/store/types';
import { DownloadType } from '@/types/instrument';
import { fetchAndStoreMusic } from '@/utils/fetchMusicIdb';
import { mergeAudios } from '@/utils/ffmpeg';
import { Music } from '@prisma/client';
import saveAs from 'file-saver';
import { DownloadIcon } from 'lucide-react';
import { useRef, useState } from 'react';

type Props = {
  music: Music;
};
function AudioDropdown({ music }: Props) {
  const [isMusicDownloading, setIsMusicDownloading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => setMenuOpen(false));
  const messageRef = useRef<HTMLParagraphElement>(null!);
  const { audioStates } = useMusicStore((state) => ({ audioStates: state.audioTracks }));

  const musicMap = {
    original: music.musicUrl,
    bass: music.bassUrl,
    drum: music.drumUrl,
    piano: music.pianoUrl,
    vocal: music.vocalUrl,
    guitar: music.guitarUrl,
    other: music.otherUrl
  };

  const downloadMixedTrack = async () => {
    if (!music) return;
    const unmutedMusicMap = [];
    for (let i = 1; i < Object.values(musicMap).length; i++) {
      const track = Object.keys(musicMap)[i];
      if (!audioStates[track as keyof AudioTracks].isMuted) {
        unmutedMusicMap.push(Object.values(musicMap)[i]);
      }
    }
    if (!unmutedMusicMap.length) {
      console.log('all track muted');
      return;
    }
    setIsMusicDownloading(true);

    const audioPromises = unmutedMusicMap.map((url) => fetchAndStoreMusic(url));
    const setteledReesult = await Promise.allSettled(audioPromises);
    const results: Array<Blob> = [];

    setteledReesult.forEach((result) => {
      if (result.status === 'rejected') {
        console.error(result.reason);
        return;
      }
      results.push(result.value);
    });

    const buffer = await mergeAudios(results, onProgress);
    saveAs(new Blob([buffer], { type: 'audio/mp3' }), `${music?.title}.mp3`);

    setIsMusicDownloading(false);
  };

  const downloadSingleTrack = async (type: DownloadType) => {
    const url = musicMap[type];
    if (!url) return;

    const blob = await fetchAndStoreMusic(url);
    saveAs(blob, `${music?.title}-${type}.mp3`);
  };

  const onProgress = (progress: number) => {
    messageRef.current.innerText = `${progress.toFixed(0)}%`;
  };

  return (
    <DropdownMenu open={menuOpen}>
      <DropdownMenuTrigger onClick={() => setMenuOpen(true)}>
        <DownloadIcon className="h-6 w-6 text-zinc-100" />
      </DropdownMenuTrigger>
      <DropdownMenuContent ref={ref}>
        <DropdownMenuItem className="flex justify-between">
          <span>Original</span>
          <DownloadIcon className="h-3.5 w-3.5" onClick={() => downloadSingleTrack('original')} />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          <div className="flex items-center gap-x-1">
            <p>Mixed</p>
            <AudioMergeTooltip />
          </div>
          {isMusicDownloading ? (
            <div className="flex items-center gap-x-1">
              <p ref={messageRef} className="text-xs text-gray-400">
                0%
              </p>
              <span className="animate-bounce">🎸</span>
            </div>
          ) : (
            <DownloadIcon onClick={downloadMixedTrack} className="h-3.5 w-3.5" />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {audioTracks.map((audio) => {
          const title = audio.type;
          return (
            <DropdownMenuItem className="flex justify-between" key={title}>
              <span>{title.charAt(0).toUpperCase() + title.slice(1)}</span>
              <DownloadIcon onClick={() => downloadSingleTrack(title)} className="h-3.5 w-3.5 cursor-pointer" />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AudioDropdown;

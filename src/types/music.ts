import { Music } from '@prisma/client';

export type YoutubeMusic = {
  id: string;
  title: string;
  parsed_artist: string;
  parsed_title: string;
  channel: string;
  thumbnail: string;
  duration: string;
};

export type MusicEssential = Pick<Music, 'id' | 'title' | 'artist'>;

export type UploadMusicUrl = MusicEssential & {
  albumCover: string;
};

export type UploadMusicFile = MusicEssential & {
  audioFile: Blob;
  albumCover: Blob;
};

export type MusicUpload = UploadMusicUrl | UploadMusicFile;

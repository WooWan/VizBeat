import { MusicUpload, UploadMusicUrl, UploadMusicFile } from '@/types/spotify';

export const isUploadWithSpotify = (upload: MusicUpload): upload is UploadMusicUrl => {
  return 'url' in upload;
};

export const isUploadWithFile = (upload: MusicUpload): upload is UploadMusicFile => {
  return 'audioFile' in upload;
};

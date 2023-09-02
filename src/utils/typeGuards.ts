import { MusicUpload, UploadMusicUrl, UploadMusicFile } from '@/types/music';

export const isUploadWithYoutube = (upload: MusicUpload): upload is UploadMusicUrl => {
  return upload.albumCover instanceof String;
};

export const isUploadWithFile = (upload: MusicUpload): upload is UploadMusicFile => {
  return upload.albumCover instanceof Blob;
};

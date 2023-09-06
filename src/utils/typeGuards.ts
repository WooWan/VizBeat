import { MusicUpload, UploadMusicUrl, UploadMusicFile } from '@/types/music';

export const isUploadWithYoutube = (upload: MusicUpload): upload is UploadMusicUrl => {
  return typeof upload.albumCover === 'string';
};

export const isUploadWithFile = (upload: MusicUpload): upload is UploadMusicFile => {
  return upload.albumCover instanceof Blob;
};

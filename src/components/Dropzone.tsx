import React, { SetStateAction, useCallback, useMemo } from 'react';
import { UploadCloudIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { MusicUpload } from '@/types/music';
import * as musicMetadata from 'music-metadata-browser';

type Props = {
  setSelectedTrack: React.Dispatch<SetStateAction<MusicUpload | undefined>>;
  setImagePreview: React.Dispatch<SetStateAction<string>>;
};

const Dropzone = ({ setSelectedTrack, setImagePreview }: Props) => {
  const onDropMusicFile = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.map((file) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const audio = await musicMetadata.parseBlob(file);
          setSelectedTrack({
            id: '',
            title: audio.common.title || '',
            artist: audio.common.artist || '',
            albumCover: new Blob([audio.common.picture?.[0].data || '']),
            audioFile: file
          });
          setImagePreview(
            URL.createObjectURL(
              new Blob([audio.common.picture?.[0].data || ''], {
                type: audio.common.picture?.[0].format
              })
            )
          );
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [setSelectedTrack, setImagePreview]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop: onDropMusicFile,
    multiple: false
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragAccept, isDragReject]
  );

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <UploadCloudIcon className="mb-2 h-10 w-10" />
      <p>{`Drag and drop an audio file`}</p>
    </div>
  );
};

export default Dropzone;

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 6,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  maxHeight: '120px'
} as const;

const acceptStyle = {
  borderColor: '#2196f3'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

import React, { useMemo } from 'react';
import { UploadCloudIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

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

type Props = {
  onDropMusicFile: (acceptedFiles: File[]) => void;
};
const Dropzone = ({ onDropMusicFile }: Props) => {
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

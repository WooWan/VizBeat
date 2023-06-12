import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

type Props = {
  onDropMusicFile: (acceptedFiles: File[]) => void;
};
const Dropzone = ({ onDropMusicFile }: Props) => {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop: onDropMusicFile,
    multiple: false
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    // @ts-ignore
    <div {...getRootProps({ style })} className={'bg-purple-300'}>
      <input {...getInputProps()} />
      <p>{`Drag 'n' drop some files here, or click to select files`}</p>
    </div>
  );
};

export default Dropzone;

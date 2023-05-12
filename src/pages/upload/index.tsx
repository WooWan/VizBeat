import React, { useEffect } from 'react';
import axios from 'axios';
const Page = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [musicUrl, setMusicUrl] = React.useState<string | null>(null);
  useEffect(() => {
    const fetchMusic = async () => {
      const res = await axios.get(
        'https://sgfbjtwrqhjzbyuhnknq.supabase.co/storage/v1/object/public/music/file_path?t=2023-05-12T08%3A08%3A26.506Z',
        {
          responseType: 'blob'
        }
      );
      const urlBlob = URL.createObjectURL(new Blob([res.data]));
      setMusicUrl(urlBlob);
    };
    fetchMusic();
  }, []);

  const splitMusic = async () => {
    console.log(musicUrl);
    const options = {
      method: 'POST',
      url: 'https://developer-api.moises.ai/api/job',
      headers: { Authorization: 'fb0bcedf-09dd-4c70-9df8-0282a7428843', 'Content-Type': 'application/json' },
      data: {
        name: 'My job 123',
        workflow: 'moises/stems-vocals-accompaniment',
        params: { inputUrl: musicUrl }
      }
    };

    const res = await axios.request(options);
    console.log(res.data);
  };
  const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" onChange={fileChangedHandler} />
      <button onClick={splitMusic}>split</button>
    </div>
  );
};

export default Page;

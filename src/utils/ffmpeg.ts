import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function mergeAudios(blobs: Blob[], onProgress: (progress: number) => void) {
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const ffmpeg = new FFmpeg();

  ffmpeg.on('progress', ({ progress }) => {
    onProgress(progress * 100);
  });

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
  });

  await encodeToMp3(blobs, ffmpeg);
  await mergeToSingleMp3(ffmpeg);

  return await ffmpeg.readFile('output.mp3');
}

async function mergeToSingleMp3(ffmpeg: any) {
  await ffmpeg.exec([
    '-i',
    'test0.mp3',
    '-i',
    'test1.mp3',
    '-i',
    'test2.mp3',
    '-i',
    'test3.mp3',
    '-i',
    'test4.mp3',
    '-i',
    'test5.mp3',
    '-filter_complex',
    '[0:a][1:a][2:a][3:a][4:a][5:a]amix=inputs=6[aout]',
    '-ac',
    '2',
    '-ar',
    '44100',
    '-ab',
    '192k',
    '-map',
    '[aout]',
    'output.mp3'
  ]);
}

async function encodeToMp3(blobs: Blob[], ffmpeg: any) {
  const promises = blobs.map((blob, index) =>
    fetchFile(URL.createObjectURL(blob)).then((file) => ffmpeg.writeFile(`test${index}.mp3`, file))
  );

  await Promise.all(promises);
}

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
  const inputFiles = [];
  const dir = await ffmpeg.listDir('/');
  for (const file of dir) {
    if (!file.isDir) {
      inputFiles.push(file.name);
    }
  }

  await mergeToSingleMp3(ffmpeg, inputFiles);
  return await ffmpeg.readFile('output.mp3');
}

async function mergeToSingleMp3(ffmpeg: any, inputFiles: string[]) {
  const inputArgs = inputFiles.map((file) => ['-i', file]);
  const filterComplex = inputArgs.map((_, index) => `[${index}:a]`).join('') + `amix=inputs=${inputFiles.length}[aout]`;
  await ffmpeg.exec([
    ...inputArgs.flat(),
    '-filter_complex',
    filterComplex,
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

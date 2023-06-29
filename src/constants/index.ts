import MusicIcon from '@/icons/MusicIcon';
import PlayIcon from '@/icons/PlayIcon';

export type ExploreCardId = (typeof exploreWorlds)[number]['id'];

export const exploreWorlds = [
  {
    id: 'instrument-2',
    imgUrl: '/images/guitar.png',
    title: 'Electric Guitar'
  },
  {
    id: 'instrument-3',
    imgUrl: '/images/drum.png',
    title: 'Drum'
  },
  {
    id: 'instrument-4',
    imgUrl: '/images/piano.png',
    title: 'Piano'
  },
  {
    id: 'instrument-5',
    imgUrl: '/images/bass_guitar.png',
    title: 'Bass Guitar'
  }
] as const;

export const startingFeatures = [
  'Upload your music that you want to split',
  'Choose the instrument you want to visualize',
  'Customize 3d your stage and your instrument'
];

export const newFeatures = [
  {
    Icon: MusicIcon,
    title: 'Music splitter',
    subtitle: 'Split instruments from music using AI algorithm'
  },
  {
    Icon: PlayIcon,
    title: 'Music Visualizer',
    subtitle: 'Visualize music with 3D animation'
  }
];

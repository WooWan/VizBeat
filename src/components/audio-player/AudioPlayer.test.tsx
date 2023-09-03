import AudioPlayer from '@/components/audio-player/AudioPlayer';
import { useMusicStore } from '@/store/music';
import { Music } from '@prisma/client';
import { render, fireEvent, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generateMockMusic } from '@/__test__/mock';

describe('AudioPlayer', () => {
  let musics: Music[];
  beforeAll(() => {
    jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(async () => {});
  });

  beforeEach(() => {
    musics = Array.from({ length: 5 }, generateMockMusic);
  });

  it('should render the component', () => {
    render(<AudioPlayer />);
    const playButton = screen.getByLabelText('Play');
    expect(playButton).toBeInTheDocument();
  });

  it('플레이 버튼을 누를 시 정지 버튼으로 바뀐다.', async () => {
    render(<AudioPlayer />);
    const playButton = screen.getByLabelText('Play');

    fireEvent.click(playButton);

    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });

  it('다음 버튼을 누를 때 음악이 바뀐다.', async () => {
    const user = userEvent.setup();

    render(<AudioPlayer musics={musics} />);

    // // Initially set the selected music
    act(() => {
      useMusicStore.getState().api.selectAudio(musics[0]);
    });

    await user.click(screen.getByLabelText('Skip Forward'));

    const selectedMusic = useMusicStore.getState().musicInfo;

    expect(selectedMusic).toEqual(musics[1]);
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });

  it('다음 버튼을 누르고 음악이 마지막이라면 처음 음악으로 바뀐다.', async () => {
    const user = userEvent.setup();

    render(<AudioPlayer musics={musics} />);

    // // Initially set the selected music
    act(() => {
      useMusicStore.getState().api.selectAudio(musics[musics.length - 1]);
    });

    await user.click(screen.getByLabelText('Skip Forward'));

    const selectedMusic = useMusicStore.getState().musicInfo;

    expect(selectedMusic).toEqual(musics[0]);
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });

  it('이전 버튼을 누를 때 음악이 바뀐다.', async () => {
    const user = userEvent.setup();

    render(<AudioPlayer musics={musics} />);

    act(() => {
      useMusicStore.getState().api.selectAudio(musics[1]);
    });

    await user.click(screen.getByLabelText('Skip Back'));

    const selectedMusic = useMusicStore.getState().musicInfo;

    expect(selectedMusic).toEqual(musics[0]);
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });

  it('이전 버튼을 누르고 음악이 처음이라면 마지막 음악으로 바뀐다.', async () => {
    const user = userEvent.setup();

    render(<AudioPlayer musics={musics} />);

    act(() => {
      useMusicStore.getState().api.selectAudio(musics[0]);
    });

    await user.click(screen.getByLabelText('Skip Back'));

    const selectedMusic = useMusicStore.getState().musicInfo;

    expect(selectedMusic).toEqual(musics[musics.length - 1]);
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });

  it('다음 음악으로 넘어가기 버튼을 누를 때 음악이 바뀐다.', async () => {
    render(<AudioPlayer />);
    const skipBackButton = screen.getByLabelText('Skip Back');

    fireEvent.click(skipBackButton);

    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });
});

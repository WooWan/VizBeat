import Dropzone from '@/components/dropzone/Dropzone';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MusicUploadForm from '@/components/form/MusicUploadForm';
import prepareReactQueryWrapper from '@/__test__/prepareReactQueryWrapper';
import React from 'react';

jest.mock('music-metadata-browser', () => ({
  parseBlob: jest.fn().mockResolvedValue({
    common: {
      title: 'Mock Title',
      artist: 'Mock Artist',
      picture: [
        {
          format: 'image/png',
          data: new Uint8Array([1, 2, 3, 4])
        }
      ]
    }
  })
}));

describe('Dropzone', () => {
  //react query setup
  const setSelectedTrack = jest.fn();
  const setImagePreview = jest.fn();
  global.URL.createObjectURL = jest.fn().mockReturnValue('mocked-url');

  const setUp = () => {
    const Wrapper = prepareReactQueryWrapper();
    render(<Dropzone setSelectedTrack={setSelectedTrack} setImagePreview={setImagePreview} />);
    render(
      <Wrapper>
        <MusicUploadForm />
      </Wrapper>
    );
  };

  it('Dropzone processes dropped file and updates state', async () => {
    setUp();
    const dropzone = screen.getByLabelText('dropzone');

    // Prepare a fake File object
    const file = new File(['audio-content'], 'sample.mp3', { type: 'audio/mp3' });

    await userEvent.upload(dropzone!, file);

    expect(setSelectedTrack).toBeCalledWith({
      id: '',
      title: 'Mock Title',
      artist: 'Mock Artist',
      albumCover: new Blob([new Uint8Array([1, 2, 3, 4])]),
      audioFile: file
    });

    expect(setImagePreview).toBeCalledWith('mocked-url');
  });
});

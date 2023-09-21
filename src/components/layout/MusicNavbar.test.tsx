import prepareReactQueryWrapper from '@/__test__/prepareReactQueryWrapper';
import MusicsNavbar from '@/components/layout/MusicsNavbar';
import { server } from '@/mocks/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, ...props }: any) => {
    return <img {...props} />;
  }
}));

describe('MusicNavbar', () => {
  beforeEach(() => {
    const QueryWrapper = prepareReactQueryWrapper();
    render(
      <QueryWrapper>
        <MusicsNavbar />
      </QueryWrapper>
    );
  });

  test('음원 리스트를 보여준다', async () => {
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  test('음원을 클릭할 경우, 음원 이미지가 변경된다', async () => {
    const items = await screen.findAllByRole('listitem');
    const firstMusic = items[0];
    await userEvent.click(firstMusic);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'http://mock-album-cover.com');
  });

  test('default 음원일 경우, delete button이 보여야 한다.', async () => {
    const items = await screen.findAllByRole('listitem');
    const firstMusic = items[0];
    await userEvent.click(firstMusic);

    const deleteButton = screen.queryByRole('button', { name: 'Delete' });
    expect(await deleteButton).not.toBeInTheDocument();
  });

  test('default 음원이 아닐 경우 delete button이 보이지 않아야 한다.', async () => {
    const items = await screen.findAllByRole('listitem');
    const firstMusic = items[1];
    await userEvent.click(firstMusic);

    const deleteButton = screen.queryByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeInTheDocument();
  });

  test('delete button을 클릭한 경우, 삭제되어야 한다', async () => {
    const resolver = jest.fn();
    server.use(rest.delete('http://localhost:3000/api/music/:id', resolver));

    const items = await screen.findAllByRole('listitem');
    const firstMusic = items[1];
    await userEvent.click(firstMusic);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(deleteButton);

    expect(resolver).toHaveBeenCalled();
  });
});

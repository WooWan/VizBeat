import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { server } from './src/mocks/server';

Object.assign(global, { TextDecoder, TextEncoder });
global.window.HTMLMediaElement.prototype.load = () => {};
window.HTMLMediaElement.prototype.play = async () => {};
window.HTMLMediaElement.prototype.pause = () => {};

jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: jest.fn()
  })
}));

//msw node server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

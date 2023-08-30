import axios from 'axios';

export const nextClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json'
  }
});

export const spotifyClient = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SPOTIFY_API_URL
  });

  instance.interceptors.request.use(async (config) => {
    const token = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token.data.access_token}`;
    }
    return config;
  });

  return instance;
};

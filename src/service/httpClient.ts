import axios from 'axios';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json'
  }
});

export const spotifyClient = () => {
  const instance = axios.create({
    baseURL: 'https://api.spotify.com/v1'
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const {
        config,
        response: { status }
      } = error;
      if (status === 401) {
        const originalRequest = config;
        const newToken = await axios.post(
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
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken.data.access_token}`;
        }
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

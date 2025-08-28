import axios from 'axios';

const API_ORIGIN =
  process.env.API_ORIGIN ??
  (process.env.NODE_ENV === 'production'
    ? 'https://frankjhub.com/main-server'
    : 'http://localhost:3100');

export const serverAxios = axios.create({
  baseURL: API_ORIGIN,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

import axios from 'axios';
import { NEXT_PUBLIC_API_URL } from '../consts';

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

const api = axios.create({
  baseURL: API_URL,
});

export function setAuthorization(value) {
  api.defaults.headers.common.Authorization = `Bearer ${value}`;
}

export default api;

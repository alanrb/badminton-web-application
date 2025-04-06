import { HttpError } from '@refinedev/core';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    CognitoAuthorization: localStorage.getItem('token'),
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.CognitoAuthorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const beErr = <ErrorResponse>error.response?.data;
    const customError: HttpError = {
      ...error,
      statusCode: error.response?.status,
      message: beErr ? beErr.error : error.response?.statusText,
    };
    return Promise.reject(customError);
  }
);

export interface ErrorResponse {
  code: number;
  error: string;
  type?: string;
}

export default api;

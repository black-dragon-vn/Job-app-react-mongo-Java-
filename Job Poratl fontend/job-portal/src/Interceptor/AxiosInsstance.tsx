/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import type { NavigateFunction } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// リクエストインターセプター：トークンを自動で追加
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// レスポンスインターセプターのセットアップ関数
let responseInterceptorId: number | null = null;

export const setupReponseIntercept = (navigate: NavigateFunction) => {
    // 既存のインターセプターがあれば削除（重複防止）
    if (responseInterceptorId !== null) {
        axiosInstance.interceptors.response.eject(responseInterceptorId);
    }

    // 新しいレスポンスインターセプターを設定
    responseInterceptorId = axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error: AxiosError) => {
            console.error('API Error:', error);

            if (error.response) {
                const status = error.response.status;

                switch (status) {
                    case 401:
                        // 認証エラー：トークン削除してログインページへ
                        console.log('401 Unauthorized - Redirecting to login');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/login');
                        break;
                    
                    case 403:
                        // 権限エラー
                        console.error('403 Forbidden - Access denied');
                        break;
                    
                    case 404:
                        console.error('404 Not Found - Resource not found');
                        break;
                    
                    case 500:
                        console.error('500 Server Error:', error.response.data);
                        break;
                    
                    default:
                        console.error(`Error ${status}:`, error.response.data);
                }
            } else if (error.request) {
                // リクエストは送信されたがレスポンスがない
                console.error('No response from server. Check if backend is running on http://localhost:8080');
            } else {
                // リクエスト設定中のエラー
                console.error('Error setting up request:', error.message);
            }

            return Promise.reject(error);
        }
    );
};

export default axiosInstance;
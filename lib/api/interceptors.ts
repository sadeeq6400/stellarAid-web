import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiClient } from './client';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  addPendingRequest,
  resolvePendingRequests,
  rejectPendingRequests,
  getIsRefreshing,
  setIsRefreshing,
  emitSessionExpired,
} from '@/lib/auth/sessionExpiry';

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    useUIStore.getState().setGlobalLoading(true);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }

    return config;
  },
  (error: AxiosError) => {
    useUIStore.getState().setGlobalLoading(false);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors and Token Refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    useUIStore.getState().setGlobalLoading(false);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError<{ message?: string }>) => {
    useUIStore.getState().setGlobalLoading(false);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (process.env.NODE_ENV === 'development') {
      console.error(`[API Error] ${error.response?.status} ${error.config?.url}`, error.response?.data || error.message);
    }

    // Handle 401 Unauthorized – queue request and prompt re-authentication
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (getIsRefreshing()) {
        // Another 401 is already being handled – queue this request
        return new Promise<string>((resolve, reject) => {
          addPendingRequest(resolve, reject);
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }).catch(() => Promise.reject(error));
      }

      setIsRefreshing(true);

      return new Promise<string>((resolve, reject) => {
        addPendingRequest(resolve, reject);
        // Signal the SessionExpiredModal to open
        emitSessionExpired(originalRequest);
      }).then((token) => {
        setIsRefreshing(false);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      }).catch(() => {
        setIsRefreshing(false);
        rejectPendingRequests();
        return Promise.reject(error);
      });
    }

    // Standardize error handling
    const apiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

export { apiClient };

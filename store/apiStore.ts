'use client';

import { create } from 'zustand';
import { toastSuccess, toastError, toastLoading, toastDismiss } from '@/utils/toast';

interface ApiState {
  loading: boolean;
  error: string | null;
  data: unknown | null;
  fetchData: (url: string) => Promise<void>;
}

export const useApiStore = create<ApiState>((set) => ({
  loading: false,
  error: null,
  data: null,
  
  fetchData: async (url: string) => {
    const loadingToastId = toastLoading('Fetching data...');
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      set({ data, loading: false });
      toastDismiss(loadingToastId);
      toastSuccess('Data fetched successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      toastDismiss(loadingToastId);
      toastError(`Failed to fetch data: ${errorMessage}`);
    }
  },
}));
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useApiData = <T>(
  apiCall: () => Promise<{ data: T }>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Specific hooks for common operations
export const useSocieties = (params?: any) => {
  return useApiData(() => apiService.societies.getAll(params), [params]);
};

export const usePendingApprovals = () => {
  return useApiData(() => apiService.admin.getPendingApprovals());
};

export const useActivityLogs = (params?: any) => {
  return useApiData(() => apiService.admin.getActivityLogs(params), [params]);
};

export const useAdminDashboard = () => {
  return useApiData(() => apiService.admin.getDashboard());
};

export const useSocietyStatistics = () => {
  return useApiData(() => apiService.societies.getStatistics());
};

// Hook for form submissions
export const useApiSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (apiCall: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};

// Hook for file downloads
export const useFileDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadFile = async (apiCall: () => Promise<{ data: Blob }>, filename: string) => {
    try {
      setDownloading(true);
      const response = await apiCall();
      
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      throw err;
    } finally {
      setDownloading(false);
    }
  };

  return { downloadFile, downloading };
};
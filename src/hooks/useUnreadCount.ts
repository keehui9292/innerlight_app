import { useState, useEffect } from 'react';
import ApiService from '../services/apiService';

export const useUnreadCount = (pollingInterval: number = 10000) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUnreadCount = async () => {
    try {
      const response = await ApiService.getTotalUnreadCount();
      if (response.success && response.data) {
        setUnreadCount(response.data.total_unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Poll for updates
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  return { unreadCount, isLoading, refetch: fetchUnreadCount };
};

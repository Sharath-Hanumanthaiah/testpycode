import React, { useEffect } from 'react';
import axios from 'axios';

function TokenRefresh({ onRefresh }) {
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.post('/api/auth/refresh-token', { token });
          if (res.data.success && res.data.data.token) {
            localStorage.setItem('token', res.data.data.token);
            if (onRefresh) onRefresh(res.data.data.token);
          }
        } catch (err) {
          // Optionally handle token refresh error
        }
      }
    }, 25 * 60 * 1000); // Refresh every 25 minutes
    return () => clearInterval(interval);
  }, [onRefresh]);
  return null;
}

export default TokenRefresh;

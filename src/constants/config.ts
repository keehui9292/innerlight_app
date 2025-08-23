export const API_CONFIG = {
  // DEV_URL: 'http://127.0.0.1:8000',
  DEV_URL: 'https://admin.innerlight.community/public',
  PROD_URL: 'https://admin.innerlight.community/public',
  SUBDOMAIN: 'innerlight', // Default subdomain, can be made configurable
  get BASE_URL() {
    return __DEV__ ? this.DEV_URL : this.PROD_URL;
  },
  get API_BASE_URL() {
    return `${this.BASE_URL}/api/v1/${this.SUBDOMAIN}`;
  }
};

export const APP_CONFIG = {
  name: 'Innerlight Community',
  version: '1.0.0',
  description: 'Member-only wellness community app',
  theme: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    background: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  }
};
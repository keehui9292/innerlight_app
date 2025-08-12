import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';
import { User, Appointment } from '../types';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = await this.getAuthToken();
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: 'GET',
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ token: string; user: User; message: string }> {
    return this.post('/api/auth/login', { email, password });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.post('/api/auth/forgot-password', { email });
  }

  async logout(): Promise<{ message: string }> {
    return this.post('/api/auth/logout');
  }

  // User endpoints
  async getProfile(): Promise<User> {
    return this.get<User>('/api/user/profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.put<User>('/api/user/profile', data);
  }

  // Appointment endpoints
  async getAppointments(): Promise<Appointment[]> {
    return this.get<Appointment[]>('/api/appointments');
  }

  async createAppointment(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    return this.post<Appointment>('/api/appointments', data);
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    return this.put<Appointment>(`/api/appointments/${id}`, data);
  }

  async deleteAppointment(id: string): Promise<{ message: string }> {
    return this.delete(`/api/appointments/${id}`);
  }

  async getAvailableSlots(date: string): Promise<{ slots: string[] }> {
    return this.get(`/api/appointments/available-slots?date=${date}`);
  }
}

export default new ApiService();
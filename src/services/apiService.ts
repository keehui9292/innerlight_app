import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';
import { User, Appointment } from '../types';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_group_id?: number;
  tier_id?: number;
}

interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AppointmentForm {
  id: number;
  name: string;
  description?: string;
  fields: any[];
}

interface TimeSlot {
  time: string;
  available: boolean;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.API_BASE_URL;
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
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
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async requestFormData<T = any>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/auth/register', data);
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/auth/login', { email, password });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/logout');
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.post<{ token: string }>('/auth/refresh');
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/forgot-password', { email });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/reset-password', data);
  }

  async verifyEmail(id: string, hash: string): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/verify-email', { id, hash });
  }

  // User endpoints
  async getProfile(): Promise<ApiResponse<User>> {
    return this.get<User>('/user/profile');
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>('/user/profile', data);
  }

  async changePassword(currentPassword: string, password: string, passwordConfirmation: string): Promise<ApiResponse<null>> {
    return this.post<null>('/user/change-password', {
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation
    });
  }

  async uploadAvatar(avatarFile: File): Promise<ApiResponse<{ avatar_url: string }>> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return this.requestFormData<{ avatar_url: string }>('/user/upload-avatar', formData);
  }

  // Websites
  async getWebsites(): Promise<ApiResponse<any[]>> {
    // This is a global endpoint, use base URL without subdomain
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/websites`);
    return await response.json();
  }

  // User Groups & Tiers
  async getUserGroups(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/user-groups');
  }

  async getTiers(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/tiers');
  }

  // Appointment endpoints
  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.get<Appointment[]>('/appointments');
  }

  async getAppointment(appointmentId: string): Promise<ApiResponse<Appointment>> {
    return this.get<Appointment>(`/appointments/${appointmentId}`);
  }

  async createAppointment(data: {
    appointment_form_id: number;
    appointment_date: string;
    appointment_time: string;
    form_data: any;
  }): Promise<ApiResponse<Appointment>> {
    return this.post<Appointment>('/appointments', data);
  }

  async updateAppointment(appointmentId: string, data: {
    appointment_date?: string;
    appointment_time?: string;
    form_data?: any;
  }): Promise<ApiResponse<Appointment>> {
    return this.put<Appointment>(`/appointments/${appointmentId}`, data);
  }

  async deleteAppointment(appointmentId: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/appointments/${appointmentId}`);
  }

  async getAppointmentForms(): Promise<ApiResponse<AppointmentForm[]>> {
    return this.get<AppointmentForm[]>('/appointment-forms');
  }

  async getAvailableSlots(formId: string, date: string): Promise<ApiResponse<TimeSlot[]>> {
    return this.get<TimeSlot[]>(`/appointment-forms/${formId}/slots?date=${date}`);
  }

  // Events
  async getEvents(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/events');
  }

  async getEvent(eventId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/events/${eventId}`);
  }

  async getUserEvents(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/user/events');
  }

  async joinEvent(eventId: string): Promise<ApiResponse<null>> {
    return this.post<null>(`/events/${eventId}/join`);
  }

  async leaveEvent(eventId: string): Promise<ApiResponse<null>> {
    return this.post<null>(`/events/${eventId}/leave`);
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<null>> {
    return this.post<null>(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<null>> {
    return this.post<null>('/notifications/read-all');
  }
}

export default new ApiService();
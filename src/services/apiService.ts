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
      return null;
    }
  }

  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      throw error;
    }
  }

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      throw error;
    }
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    // List of endpoints that don't require authentication
    const publicEndpoints = [
      '/auth/login',
      '/auth/register', 
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email'
    ];
    
    // Check if this endpoint requires authentication
    const requiresAuth = !publicEndpoints.some(publicEndpoint => endpoint === publicEndpoint);
    
    let token = null;
    if (requiresAuth) {
      token = await this.getAuthToken();
    }
    
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
        // If it's a validation error (422) or similar, return the structured error response
        if (response.status === 422 || responseData.errors) {
          return {
            success: false,
            message: responseData.message || 'Validation failed',
            errors: responseData.errors || {}
          };
        }
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async requestFormData<T = any>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    // List of endpoints that don't require authentication
    const publicEndpoints = [
      '/auth/login',
      '/auth/register', 
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email'
    ];
    
    // Check if this endpoint requires authentication
    const requiresAuth = !publicEndpoints.some(publicEndpoint => endpoint === publicEndpoint);
    
    let token = null;
    if (requiresAuth) {
      token = await this.getAuthToken();
    }
    
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
    const response = await this.post<LoginResponse>('/auth/register', data);
    
    // Save token to AsyncStorage after successful registration
    if (response.success && response.data?.token) {
      await this.saveAuthToken(response.data.token);
    }
    
    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/auth/login', { email, password });
    
    // Save token to AsyncStorage after successful login
    if (response.success && response.data?.token) {
      await this.saveAuthToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.post<null>('/auth/logout');
    
    // Remove token from AsyncStorage after logout
    if (response.success) {
      await this.removeAuthToken();
    }
    
    return response;
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.post<{ token: string }>('/auth/refresh');
    
    // Save new token to AsyncStorage after successful refresh
    if (response.success && response.data?.token) {
      await this.saveAuthToken(response.data.token);
    }
    
    return response;
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

  async cancelAppointment(appointmentId: string): Promise<ApiResponse<null>> {
    return this.post<null>(`/appointments/${appointmentId}/cancel`);
  }

  async getAppointmentForms(): Promise<ApiResponse<AppointmentForm[]>> {
    return this.get<AppointmentForm[]>('/appointment-forms');
  }

  async getAvailableSlots(formId: string, date: string): Promise<ApiResponse<TimeSlot[]>> {
    return this.get<TimeSlot[]>(`/appointment-forms/${formId}/slots?date=${date}`);
  }

  async getAppointmentPaymentStatus(appointmentId: string): Promise<ApiResponse<{
    appointment_id: string;
    reference_number: string;
    payment_status: string;
    is_paid: boolean;
    paid_at: string | null;
    total_price: number;
    payment_required: boolean;
    appointment_status: string;
    appointment_date: string;
    appointment_time: string;
    customer_name: string;
    customer_email: string;
  }>> {
    return this.get(`/payment-status/${appointmentId}`);
  }

  async getPaymentHistory(): Promise<ApiResponse<{
    payment_history: Array<{
      appointment_id: string;
      appointment_form_name: string;
      appointment_date: string;
      appointment_time: string;
      appointment_status: string;
      total_price: string;
      payment_status: string;
      payment_required: boolean;
      is_paid: boolean;
      paid_at: string | null;
      payment_session_id: string | null;
      payment_intent_id: string | null;
      created_at: string;
      updated_at: string;
    }>;
    summary: {
      total_appointments: number;
      paid_appointments: number;
      pending_payments: number;
      total_amount_paid: number;
      total_amount_pending: number;
      free_appointments: number;
    };
  }>> {
    return this.get('/user/payment-history');
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

  // Testimonials
  async getDetoxificationTestimonialForm(): Promise<ApiResponse<{
    id: string;
    name: string;
    description: string | null;
    slug: string;
    category: string;
    category_label: string;
    fields: Array<{
      type: string;
      name: string;
      label: string;
      required?: string;
      placeholder?: string | null;
      options?: Array<{
        value: string;
        label: string;
        price?: number;
      }> | null;
    }>;
    requires_photos: boolean;
    requires_before_after: boolean;
    has_daily_tracking: boolean;
    diary_days: number;
    website: {
      id: string;
      name: string;
      subdomain: string;
      logo: string | null;
    };
  }>> {
    return this.get('/feedback/detoxification');
  }

  async submitDetoxificationTestimonial(formData: Record<string, any>): Promise<ApiResponse<{
    testimonial_id: string;
    status: string;
    submitted_at: string;
    has_daily_tracking: boolean;
    diary_days: number;
  }>> {
    return this.post('/feedback/detoxification', formData);
  }

  async getTestimonials(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/testimonials');
  }

  async getPublicTestimonials(page: number = 1, perPage: number = 10): Promise<ApiResponse<any[]> & {
    pagination?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
      has_more_pages: boolean;
      links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
      };
    };
  }> {
    const endpoint = `/testimonials/public?page=${page}&per_page=${perPage}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method: 'GET',
      headers: defaultHeaders,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 422 || responseData.errors) {
          return {
            success: false,
            message: responseData.message || 'Validation failed',
            errors: responseData.errors || {}
          };
        }
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async getTestimonialTemplates(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/testimonial-templates');
  }

  async submitDailyTracking(testimonialId: string, dayNumber: number, data: {
    initial_data?: Record<string, string>;
    daily_data: Record<string, string>;
  }): Promise<ApiResponse<{
    day_number: number;
    initial_data?: Record<string, string>;
    daily_data: Record<string, string>;
  }>> {
    return this.post(`/testimonials/${testimonialId}/day/${dayNumber}`, data);
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

  // Forum endpoints
  async getForumAnnouncements(page: number = 1): Promise<ApiResponse<any>> {
    return this.get(`/forum/announcements?page=${page}`);
  }

  async getForumTopics(page: number = 1): Promise<ApiResponse<any>> {
    return this.get(`/forum/topics?page=${page}`);
  }

  async getTopicDetails(topicId: string): Promise<ApiResponse<any>> {
    return this.get(`/forum/topics/${topicId}`);
  }

  async getTopicComments(topicId: string, page: number = 1): Promise<ApiResponse<any>> {
    return this.get(`/forum/topics/${topicId}/comments?page=${page}`);
  }

  async createTopic(data: {
    title: string;
    content: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/forum/topics', data);
  }

  async createComment(topicId: string, data: {
    content: string;
    parent_id?: string;
  }): Promise<ApiResponse<any>> {
    return this.post(`/forum/topics/${topicId}/comments`, data);
  }

  async updateComment(commentId: string, data: {
    content: string;
  }): Promise<ApiResponse<any>> {
    return this.put(`/forum/comments/${commentId}`, data);
  }

  async deleteComment(commentId: string): Promise<ApiResponse<any>> {
    return this.delete(`/forum/comments/${commentId}`);
  }

  async getForumCategories(): Promise<ApiResponse<any>> {
    return this.get('/forum/categories');
  }

  // Chart/Organization endpoints
  async getUserChart(levels: number = 4): Promise<ApiResponse<any>> {
    return this.get(`/user/chart?levels=${levels}`);
  }

  async findLastPersons(): Promise<ApiResponse<any>> {
    return this.get('/user/find-last-persons');
  }

  async findAngelBuilders(): Promise<ApiResponse<any>> {
    return this.get('/user/find-angel-builders');
  }

  // Dashboard Statistics endpoint
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.get('/user/dashboard-stats');
  }
}

export default new ApiService();
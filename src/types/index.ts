// Common type definitions for the Innerlight Community app

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  appointment_form_id: string;
  user_id: string;
  website_id: string;
  appointment_date: string;
  appointment_time: string;
  form_data: {
    appointment_date?: string;
    appointment_time?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    service_type?: string;
    notes?: string;
    [key: string]: any;
  };
  total_price: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
  mou_link?: string | null;
  mou_status?: 'pending' | 'signed' | null;
  appointment_form: {
    id: string;
    name: string;
    description?: string | null;
  };
  mou_record?: {
    id: string;
    appointment_id: string;
    mou_template_id: string;
    user_id: string;
    mou_data: any[];
    signature_path?: string | null;
    signed_at?: string | null;
    status: 'pending' | 'signed';
    created_at: string;
    updated_at: string;
  } | null;
  // Legacy fields for backward compatibility
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  provider?: string;
  location?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  must_change_password?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface FormInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  required?: boolean;
}

export interface CustomButtonProps {
  title?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    user_group_id?: number;
    tier_id?: number;
  }) => Promise<AuthResponse>;
  loading: boolean;
}

// Navigation Types
export type RootStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  RequestOTP: { email: string };
  VerifyOTP: { email: string };
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  AppointmentForm: undefined;
  AppointmentDetails: {
    appointment: Appointment;
  };
};

export type StackScreenProps<T extends keyof RootStackParamList> = {
  navigation: any;
  route: any;
};

export type TabScreenProps<T extends keyof MainTabParamList> = {
  navigation: any;
  route: any;
};
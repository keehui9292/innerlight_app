import React, { useState } from 'react';
import { Platform, Alert, StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/common/FormInput';
import CustomButton from '../../components/common/Button';
import { StackScreenProps } from '../../types';
import { theme } from '../../constants/theme';

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

const RegisterScreen: React.FC<StackScreenProps<'Register'>> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { register, loading } = useAuth();

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.password_confirmation.trim()) {
      newErrors.password_confirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) return;

    const result = await register(formData);
    
    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
    }
    // If successful, the AuthContext will automatically navigate to the main app
  };

  const handleBackToLogin = (): void => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                Create Account
              </Text>
            </View>

            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.title}>
                Join Innerlight Community
              </Text>
              <Text style={styles.subtitle}>
                Create your account to access our wellness community
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <FormInput
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                error={errors.name}
                autoCapitalize="words"
                required
              />

              <FormInput
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />

              <FormInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                error={errors.password}
                secureTextEntry
                required
              />

              <FormInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChangeText={(value) => handleInputChange('password_confirmation', value)}
                error={errors.password_confirmation}
                secureTextEntry
                required
              />

              <CustomButton
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                size="lg"
                colorScheme="primary"
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account? 
              </Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.linkText}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  welcomeSection: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  linkText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
    marginLeft: theme.spacing.xs,
  },
});

export default RegisterScreen;
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native';
import { CustomButtonProps } from '../../types';

const CustomButton: React.FC<CustomButtonProps & TouchableOpacityProps> = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  size = 'md',
  colorScheme = 'primary',
  fullWidth = true,
  children,
  ...props 
}) => {
  const getButtonStyle = () => {
    return [
      styles.button,
      fullWidth && styles.fullWidth,
      size === 'lg' && styles.large,
      (disabled || loading) && styles.disabled,
      colorScheme === 'primary' && styles.primary,
      colorScheme === 'secondary' && styles.secondary,
      colorScheme === 'success' && styles.success,
      colorScheme === 'warning' && styles.warning,
      colorScheme === 'danger' && styles.danger,
      !colorScheme || colorScheme === 'primary' ? styles.primary : null,
    ].filter(Boolean);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={0.8}
      {...props}
    >
      {loading && <ActivityIndicator color="#ffffff" size="small" style={styles.spinner} />}
      <Text style={styles.buttonText}>
        {children || title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  large: {
    paddingVertical: 16,
    minHeight: 56,
  },
  primary: {
    backgroundColor: '#6366f1',
  },
  secondary: {
    backgroundColor: '#6b7280',
  },
  success: {
    backgroundColor: '#16a34a',
  },
  warning: {
    backgroundColor: '#f59e0b',
  },
  danger: {
    backgroundColor: '#ef4444',
  },
  disabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  spinner: {
    marginRight: 8,
  },
});

export default CustomButton;
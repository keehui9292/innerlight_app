import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native';
import { CustomButtonProps } from '../../types';
import { theme } from '../../constants/theme';

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

  const getTextStyle = () => {
    return [
      styles.buttonText,
      colorScheme === 'secondary' && styles.secondaryText,
    ].filter(Boolean);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={0.8}
      {...props}
    >
      {loading && <ActivityIndicator color={colorScheme === 'secondary' ? theme.colors.primary : theme.colors.white} size="small" style={styles.spinner} />}
      <Text style={getTextStyle()}>
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
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    minHeight: 48,
    ...theme.shadows.light,
  },
  fullWidth: {
    width: '100%',
  },
  large: {
    paddingVertical: theme.spacing.lg,
    minHeight: 56,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  success: {
    backgroundColor: theme.colors.success,
  },
  warning: {
    backgroundColor: theme.colors.warning,
  },
  danger: {
    backgroundColor: theme.colors.error,
  },
  disabled: {
    backgroundColor: theme.colors.border.light,
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    textAlign: 'center',
  },
  spinner: {
    marginRight: theme.spacing.sm,
  },
  secondaryText: {
    color: theme.colors.primary,
  },
});

export default CustomButton;
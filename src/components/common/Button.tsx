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
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minHeight: 36,
    ...theme.shadows.elegant,
  },
  fullWidth: {
    width: '100%',
  },
  large: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 40,
    borderRadius: theme.borderRadius.md,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
  },
  success: {
    backgroundColor: theme.colors.success,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  warning: {
    backgroundColor: theme.colors.warning,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  danger: {
    backgroundColor: theme.colors.error,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  disabled: {
    backgroundColor: theme.colors.border.subtle,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  spinner: {
    marginRight: theme.spacing.md,
  },
  secondaryText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
});

export default CustomButton;
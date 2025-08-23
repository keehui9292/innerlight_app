import React, { useState } from 'react';
import { TouchableOpacity, View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { FormInputProps } from '../../types';
import { theme } from '../../constants/theme';

const FormInput: React.FC<FormInputProps & TextInputProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  error, 
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  required = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputContainerError : styles.inputContainerNormal,
        value ? styles.inputContainerFocused : null
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={theme.colors.text.muted}
          selectionColor={theme.colors.primary}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.text.secondary} />
            ) : (
              <Eye size={20} color={theme.colors.text.secondary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.1,
  },
  inputContainer: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    minHeight: 44,
    justifyContent: 'center',
    ...theme.shadows.elegant,
  },
  inputContainerNormal: {
    borderColor: theme.colors.border.default,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryGhost,
    ...theme.shadows.soft,
  },
  inputContainerError: {
    borderColor: theme.colors.error,
    backgroundColor: '#fef2f0',
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.regular,
    letterSpacing: -0.1,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.sm,
    fontWeight: theme.typography.weights.medium,
  },
});

export default FormInput;
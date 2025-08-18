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
    <View style={[styles.container, { marginBottom: 16 }]}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : styles.inputNormal
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={theme.colors.text.muted}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
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
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 48,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    color: theme.colors.text.primary,
    ...theme.shadows.light,
  },
  inputNormal: {
    borderColor: theme.colors.border.light,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: 14,
  },
  errorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default FormInput;
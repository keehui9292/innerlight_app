import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '../../types';
import { theme } from '../../constants/theme';

const GetStartedScreen: React.FC<StackScreenProps<'GetStarted'>> = ({ navigation }) => {
  const handleGetStarted = (): void => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Floating Elements */}
          <View style={styles.floatingElement1}>
            <Text style={styles.floatingIcon}>✨</Text>
          </View>
          <View style={styles.floatingElement2}>
            <Text style={styles.floatingIcon}>🤍</Text>
          </View>
          <View style={styles.floatingElement3}>
            <Text style={styles.floatingIcon}>🌿</Text>
          </View>
          
          {/* Main Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.iconGradient}>
              <Text style={styles.heroIcon}>🧘‍♀️</Text>
            </View>
            <Text style={styles.heroTagline}>Innerlight</Text>
            <Text style={styles.heroSubtagline}>Community</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>Begin Your Wellness Journey</Text>
          <Text style={styles.subtitle}>
            Connect with healers, join a caring community, and transform your life through personalized wellness experiences
          </Text>
          
          {/* Feature highlights */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌟</Text>
              <Text style={styles.featureText}>Personalized Care</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🤝</Text>
              <Text style={styles.featureText}>Community Support</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌱</Text>
              <Text style={styles.featureText}>Growth Journey</Text>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  heroSection: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  floatingElement1: {
    position: 'absolute',
    top: 20,
    right: 30,
    backgroundColor: theme.colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  floatingElement2: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: theme.colors.white,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  floatingElement3: {
    position: 'absolute',
    top: 80,
    left: 40,
    backgroundColor: theme.colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  floatingIcon: {
    fontSize: 16,
  },
  heroCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    ...theme.shadows.soft,
    width: '85%',
    maxWidth: 240,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroIcon: {
    fontSize: 36,
  },
  heroTagline: {
    fontSize: 22,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: theme.spacing.xs,
  },
  heroSubtagline: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  contentSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: theme.spacing.sm,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: theme.typography.weights.medium,
  },
  bottomSection: {
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    alignItems: 'center',
    ...theme.shadows.elegant,
    minHeight: 44,
  },
  getStartedText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    letterSpacing: -0.1,
  },
});

export default GetStartedScreen;
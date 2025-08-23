import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '../../types';
import { theme } from '../../constants/theme';

const GetStartedScreen: React.FC<StackScreenProps<'GetStarted'>> = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation loop
    const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 5,
            duration: 2000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
           Animated.timing(animValue, {
            toValue: -5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatingAnimation(floatAnim1, 0).start();
    createFloatingAnimation(floatAnim2, 500).start();
    createFloatingAnimation(floatAnim3, 1000).start();
  }, [fadeAnim, slideAnim, floatAnim1, floatAnim2, floatAnim3]);

  const handleGetStarted = (): void => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Floating Elements */}
          <Animated.View style={[styles.floatingElement1, { transform: [{ translateY: floatAnim1 }] }]}>
            <Text style={styles.floatingIcon}>✨</Text>
          </Animated.View>
          <Animated.View style={[styles.floatingElement2, { transform: [{ translateY: floatAnim2 }] }]}>
            <Text style={styles.floatingIcon}>🤍</Text>
          </Animated.View>
          <Animated.View style={[styles.floatingElement3, { transform: [{ translateY: floatAnim3 }] }]}>
            <Text style={styles.floatingIcon}>🌿</Text>
          </Animated.View>
          
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
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg, // Increased horizontal padding
    paddingBottom: theme.spacing.lg,
  },
  heroSection: {
    flex: 1, // Given more space to hero section
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingElement1: {
    position: 'absolute',
    top: '15%',
    right: '5%',
    backgroundColor: theme.colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.elegant, // Using a more pronounced shadow
  },
  floatingElement2: {
    position: 'absolute',
    bottom: '20%',
    left: '0%',
    backgroundColor: theme.colors.white,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.elegant,
  },
  floatingElement3: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    backgroundColor: theme.colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.elegant,
  },
  floatingIcon: {
    fontSize: 20, // Slightly larger icons
  },
  heroCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    ...theme.shadows.elegant,
    width: '80%',
    maxWidth: 280, // Increased max width
  },
  iconGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroIcon: {
    fontSize: 42, // Larger main icon
  },
  heroTagline: {
    fontSize: 26, // More impactful tagline
    fontWeight: theme.typography.weights.bold, // Bolder
    color: theme.colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: theme.spacing.xs,
  },
  heroSubtagline: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium, // Medium weight
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  title: {
    fontSize: 28, // Larger title
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md, // Larger subtitle for readability
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24, // Improved line height
    marginBottom: theme.spacing.xl,
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
    fontSize: 24, // Larger feature icons
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: theme.typography.weights.medium,
  },
  bottomSection: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg, // Taller button
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl, // More rounded
    width: '100%',
    alignItems: 'center',
    ...theme.shadows.elegant,
    minHeight: 50, // Minimum height for better tap target
  },
  getStartedText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md, // Larger text
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5, // Added letter spacing
  },
});

export default GetStartedScreen;
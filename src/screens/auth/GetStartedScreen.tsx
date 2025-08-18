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
          {/* Stats Badge - Top Left */}
          <View style={styles.statsBadge}>
            <Text style={styles.statsNumber}>70K+</Text>
            <Text style={styles.statsLabel}>Members</Text>
          </View>

          {/* Main Character Circle with Arc Background */}
          <View style={styles.characterContainer}>
            {/* Background Arc */}
            <View style={styles.arcBackground}>
              <View style={styles.characterCircle}>
                <Text style={styles.characterEmoji}>🧘‍♀️</Text>
              </View>
            </View>
          </View>

          {/* Stats Badge - Bottom Right */}
          <View style={styles.sessionsStats}>
            <Text style={styles.sessionsNumber}>700K+</Text>
            <Text style={styles.sessionsLabel}>Sessions</Text>
          </View>

          {/* Decorative Dots */}
          <View style={styles.dot1} />
          <View style={styles.dot2} />
          <View style={styles.dot3} />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>Everything you need{'\n'}in one app</Text>
          <Text style={styles.subtitle}>
            Create your wellness journey and connect with{'\n'}
            the top practitioners in the world
          </Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
          
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.activeDot]} />
            <View style={styles.progressLine} />
          </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  heroSection: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  statsBadge: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...theme.shadows.medium,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  statsLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arcBackground: {
    width: 200,
    height: 200,
    borderRadius: 120,
    borderWidth: 20,
    borderColor: theme.colors.primary,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
    ...theme.shadows.medium,
  },
  characterEmoji: {
    fontSize: 50,
  },
  sessionsStats: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...theme.shadows.medium,
    alignItems: 'center',
  },
  sessionsNumber: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  sessionsLabel: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  dot1: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    top: 80,
    right: 60,
  },
  dot2: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    bottom: 120,
    left: 40,
  },
  dot3: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06b6d4',
    top: 180,
    right: 30,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: 25,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 35,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.medium,
    marginBottom: theme.spacing.xl,
  },
  getStartedText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.white,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border.light,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
  progressLine: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
    borderRadius: 2,
  },
});

export default GetStartedScreen;
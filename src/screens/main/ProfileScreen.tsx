import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Platform, Alert, View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Copy
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  email_verified_at: string;
  role: string;
  referral_code: string;
  created_at: string;
  metahealers_status: string;
  john_course_status: string;
  naha_intro_status: string;
  website: {
    name: string;
    domain: string;
  };
}

const ProfileScreen: React.FC<TabScreenProps<'Profile'>> = () => {
  const { user, logout } = useAuth() as any;
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await ApiService.getMe() as any;
      
      if (response.success && response.data) {
        // Handle nested user data structure
        const userData = response.data.user || response.data;
        setProfileData(userData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Unknown';
    }
  };

  const currentUser = profileData || user;
  
  const userInfo = [
    {
      label: 'Email',
      value: currentUser?.email || 'Not provided',
      icon: Mail
    },
    {
      label: 'Phone',
      value: currentUser?.phone || 'Not provided',
      icon: Phone
    },
    {
      label: 'Role',
      value: currentUser?.role?.charAt(0).toUpperCase() + currentUser?.role?.slice(1) || 'User',
      icon: User
    }
  ];

  const menuItems = [
    {
      title: 'Account Settings',
      description: 'Manage your personal information',
      icon: Settings,
      onPress: () => console.log('Account Settings'),
    },
    {
      title: 'Notifications',
      description: 'Configure your notification preferences',
      icon: Bell,
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      icon: Shield,
      onPress: () => console.log('Privacy & Security'),
    },
  ];

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]
      );
    }
  };

  const getInitials = (name: any) => {
    if (!name) return 'U';
    return name.split(' ').map((n: any) => n[0]).join('').toUpperCase();
  };

  const getMemberSince = (): string => {
    const createdAt = currentUser?.created_at;
    if (!createdAt) return new Date().getFullYear().toString();
    return formatDate(createdAt);
  };

  const copyReferralCode = async (): Promise<void> => {
    if (currentUser?.referral_code) {
      try {
        await Clipboard.setString(currentUser.referral_code);
        Alert.alert('Copied!', 'Referral code copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        Alert.alert('Error', 'Failed to copy referral code');
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Hero Profile Section */}
          <View style={styles.heroSection}>
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(currentUser?.name)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.userName}>
                {currentUser?.name || 'Member Name'}
              </Text>
              
              <Text style={styles.memberSince}>
                Member since {getMemberSince()}
              </Text>
              
              {currentUser?.referral_code && (
                <TouchableOpacity 
                  onPress={copyReferralCode}
                  style={styles.referralCodeContainer}
                  activeOpacity={0.8}
                >
                  <Text style={styles.referralCodeLabel}>
                    Referral Code
                  </Text>
                  <View style={styles.referralCodeBox}>
                    <Text style={styles.referralCode}>
                      {currentUser.referral_code}
                    </Text>
                    <Copy size={16} color={theme.colors.primary} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* User Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoCard}>
              {userInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <View key={index} style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <IconComponent size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>
                        {info.label}
                      </Text>
                      <Text style={styles.infoValue}>
                        {info.value}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Course Status Section */}
          {(currentUser?.metahealers_status || currentUser?.john_course_status || currentUser?.naha_intro_status) && (
            <View style={styles.courseSection}>
              <Text style={styles.sectionTitle}>Course Status</Text>
              <View style={styles.courseStatusCard}>
                {currentUser?.metahealers_status && (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Metahealers</Text>
                    <View style={[styles.statusBadge, {
                      backgroundColor: currentUser.metahealers_status === 'Active' ? '#dcfce7' : '#fef3c7'
                    }]}>
                      <Text style={[styles.statusText, {
                        color: currentUser.metahealers_status === 'Active' ? '#15803d' : '#d97706'
                      }]}>
                        {currentUser.metahealers_status}
                      </Text>
                    </View>
                  </View>
                )}
                {currentUser?.john_course_status && (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>John Course</Text>
                    <View style={[styles.statusBadge, {
                      backgroundColor: currentUser.john_course_status === 'Active' ? '#dcfce7' : '#fef3c7'
                    }]}>
                      <Text style={[styles.statusText, {
                        color: currentUser.john_course_status === 'Active' ? '#15803d' : '#d97706'
                      }]}>
                        {currentUser.john_course_status}
                      </Text>
                    </View>
                  </View>
                )}
                {currentUser?.naha_intro_status && (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>NAHA Intro</Text>
                    <View style={[styles.statusBadge, {
                      backgroundColor: currentUser.naha_intro_status === 'Active' ? '#dcfce7' : '#fef3c7'
                    }]}>
                      <Text style={[styles.statusText, {
                        color: currentUser.naha_intro_status === 'Active' ? '#15803d' : '#d97706'
                      }]}>
                        {currentUser.naha_intro_status}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Settings Menu */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsCard}>
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    style={[
                      styles.menuItem,
                      index < menuItems.length - 1 && styles.menuItemBorder
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuIconContainer}>
                        <IconComponent size={22} color={theme.colors.primary} />
                      </View>
                      
                      <View style={styles.menuTextContent}>
                        <Text style={styles.menuTitle}>
                          {item.title}
                        </Text>
                        <Text style={styles.menuDescription}>
                          {item.description}
                        </Text>
                      </View>
                      
                      <ChevronRight size={20} color={theme.colors.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.signOutButton}
            activeOpacity={0.8}
          >
            <View style={styles.signOutContent}>
              <View style={styles.signOutIconContainer}>
                <LogOut size={22} color={theme.colors.error} />
              </View>
              
              <Text style={styles.signOutTitle}>
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appName}>
              Innerlight Community
            </Text>
            <Text style={styles.appVersion}>
              Version 1.0.0
            </Text>
            <Text style={styles.appTagline}>
              Your wellness journey starts here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  heroSection: {
    marginBottom: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.elegant,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: theme.typography.weights.medium,
    letterSpacing: -0.2,
  },
  userName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  memberSince: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    letterSpacing: -0.1,
  },
  memberType: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  referralCodeContainer: {
    width: '100%',
  },
  referralCodeLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    letterSpacing: 0.2,
  },
  referralCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primaryGhost,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  referralCode: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
    letterSpacing: 2,
  },
  copyIcon: {
    marginLeft: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  infoSection: {
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.elegant,
    marginHorizontal: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.regular,
    letterSpacing: -0.2,
  },
  courseSection: {
    marginBottom: theme.spacing.lg,
  },
  courseStatusCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.light,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  statusLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'capitalize',
  },
  settingsSection: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.2,
  },
  settingsCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.elegant,
    marginHorizontal: theme.spacing.xs,
  },
  menuItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  signOutIcon: {
    backgroundColor: '#fecaca',
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.1,
  },
  menuDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    lineHeight: 18,
  },
  itemSpacer: {
    height: theme.spacing.sm,
  },
  signOutButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.elegant,
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutIconContainer: {
    marginRight: theme.spacing.md,
  },
  signOutTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.error,
    letterSpacing: -0.2,
  },
  appInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
  },
  appName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  appVersion: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});

export default ProfileScreen;
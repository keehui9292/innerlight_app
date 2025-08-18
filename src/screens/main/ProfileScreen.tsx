import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Platform, Alert, View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
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
  MapPin
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
          {/* Header */}
          <Text style={styles.title}>Profile</Text>

          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(currentUser?.name)}
                </Text>
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {currentUser?.name || 'Member Name'}
                </Text>
                <Text style={styles.memberSince}>
                  Member since {getMemberSince()}
                </Text>
                {currentUser?.referral_code && (
                  <Text style={styles.referralCode}>
                    Referral Code: {currentUser.referral_code}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            {/* User Information */}
            <View style={styles.userDetails}>
              {userInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <View key={index} style={styles.detailRow}>
                    <IconComponent size={16} color={theme.colors.text.secondary} />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>
                        {info.label.toUpperCase()}
                      </Text>
                      <Text style={styles.detailValue}>
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
            
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Fragment key={index}>
                  <TouchableOpacity
                    onPress={item.onPress}
                    style={styles.menuItem}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuIcon}>
                        <IconComponent size={20} color={theme.colors.text.secondary} />
                      </View>
                      
                      <View style={styles.menuText}>
                        <Text style={styles.menuTitle}>
                          {item.title}
                        </Text>
                        <Text style={styles.menuDescription}>
                          {item.description}
                        </Text>
                      </View>
                      
                      <ChevronRight size={20} color={theme.colors.text.muted} />
                    </View>
                  </TouchableOpacity>
                  
                  {index < menuItems.length - 1 && <View style={styles.itemSpacer} />}
                </Fragment>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.signOutButton}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.menuIcon, styles.signOutIcon]}>
                <LogOut size={20} color={theme.colors.error} />
              </View>
              
              <View style={styles.menuText}>
                <Text style={styles.signOutTitle}>
                  Sign Out
                </Text>
                <Text style={styles.signOutDescription}>
                  Sign out of your account
                </Text>
              </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  memberSince: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.weights.medium,
  },
  memberType: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  referralCode: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.weights.medium,
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
  userDetails: {
    gap: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
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
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.light,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutIcon: {
    backgroundColor: '#fecaca',
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  menuDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  signOutTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.error,
  },
  signOutDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
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
    ...theme.shadows.light,
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
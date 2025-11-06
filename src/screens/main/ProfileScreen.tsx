import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Platform, Alert, View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { useAuth } from '../../context/AuthContext';
import { TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface UplineEnrolerUser {
  id: string;
  member_id: string;
  name: string;
  email: string;
  phone?: string;
  referral_code: string;
  status: string;
}

interface Address {
  address: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
}

interface UserProfile {
  id: string;
  member_id: string;
  name: string;
  email: string;
  phone?: string;
  email_verified_at: string | null;
  must_change_password: number;
  role: string;
  status: string;
  user_group_id: string | null;
  tier_id: string | null;
  referral_code: string;
  upline_id: string | null;
  enroler_id: string | null;
  created_at: string;
  updated_at: string;
  team_name: string | null;
  metahealers_status: string;
  john_course_status: string;
  naha_intro_status: string;
  metahealers_expiry_date: string | null;
  john_course_expiry_date: string | null;
  naha_intro_expiry_date: string | null;
  merit_points: string;
  user_group: {
    name: string;
  } | null;
  tier: {
    name: string;
  } | null;
  website: {
    id: string;
    name: string;
    domain: string;
    subdomain: string;
    status: string;
  };
  address: Address | null;
  upline: UplineEnrolerUser | null;
  enroler: UplineEnrolerUser | null;
}


const ProfileScreen: React.FC<TabScreenProps<'Profile'>> = ({ navigation }) => {
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

  const formatFullDate = (dateString: string | null): string => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const currentUser = profileData || user;

  const accountInfo = [
    {
      label: 'Member ID',
      value: currentUser?.member_id || 'Not available',
      icon: 'Hash'
    },
    {
      label: 'Account Status',
      value: currentUser?.status || 'Unknown',
      icon: 'CheckCircle',
      isStatus: true
    },
    {
      label: 'Email Verified',
      value: currentUser?.email_verified_at ? 'Verified' : 'Not Verified',
      icon: 'Shield',
      isVerified: !!currentUser?.email_verified_at
    }
  ];

  const userInfo = [
    {
      label: 'Email',
      value: currentUser?.email || 'Not provided',
      icon: 'Mail'
    },
    {
      label: 'Phone',
      value: currentUser?.phone || 'Not provided',
      icon: 'Phone'
    },
    {
      label: 'Role',
      value: currentUser?.role?.charAt(0).toUpperCase() + currentUser?.role?.slice(1) || 'User',
      icon: 'User'
    }
  ];

  const networkInfo = [
    {
      label: 'Merit Points',
      value: currentUser?.merit_points || '0',
      icon: 'Award'
    },
    {
      label: 'User Group',
      value: currentUser?.user_group?.name || 'Not assigned',
      icon: 'Users'
    },
    {
      label: 'Tier',
      value: currentUser?.tier?.name || 'Not assigned',
      icon: 'Star'
    },
    {
      label: 'Team',
      value: currentUser?.team_name || 'Not assigned',
      icon: 'Flag'
    }
  ];

  // Check if user is Angel Builder
  const isAngelBuilder = currentUser?.user_group?.name === 'Angel Builder';

  const menuItems = [
    {
      title: 'Downline Chart',
      description: 'View your network organization chart',
      icon: 'GitBranch',
      onPress: () => navigation.navigate('DownlineChart'),
    },
    {
      title: 'Payment History',
      description: 'View your payment records',
      icon: 'DollarSign',
      onPress: () => navigation.navigate('PaymentHistory'),
    },
    {
      title: 'Share Your Story',
      description: 'Submit testimonials and reviews',
      icon: 'MessageSquare',
      onPress: () => navigation.navigate('Testimonial'),
    },
    {
      title: 'Account Settings',
      description: 'Manage your personal information',
      icon: 'Settings',
      onPress: () => console.log('Account Settings'),
    },
    {
      title: 'Notifications',
      description: 'Configure your notification preferences',
      icon: 'Bell',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      icon: 'Shield',
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
    console.log('copyReferralCode called');
    console.log('currentUser?.referral_code:', currentUser?.referral_code);
    
    if (currentUser?.referral_code) {
      try {
        await Clipboard.setStringAsync(currentUser.referral_code);
        console.log('Clipboard.setStringAsync successful');
        Alert.alert(
          '✅ Copied!', 
          `Your referral code "${currentUser.referral_code}" has been copied to clipboard. Share it with friends to invite them!`,
          [{ text: 'OK', style: 'default' }]
        );
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        Alert.alert(
          '❌ Error', 
          'Failed to copy referral code. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } else {
      Alert.alert(
        '⚠️ No Referral Code', 
        'Your referral code is not available at the moment.',
        [{ text: 'OK', style: 'default' }]
      );
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
                    <WebSafeIcon name="Copy" size={16} color={theme.colors.primary} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Angel Builder Dashboard - Only for Angel Builder users */}
          {isAngelBuilder && (
            <View style={styles.angelBuilderSection}>
              <Text style={styles.sectionTitle}>Angel Builder</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AngelBuilderDashboard')}
                style={styles.angelBuilderCard}
                activeOpacity={0.8}
              >
                <View style={styles.angelBuilderContent}>
                  <View style={styles.angelBuilderIconContainer}>
                    <WebSafeIcon name="TrendingUp" size={24} color={theme.colors.primary} />
                  </View>

                  <View style={styles.angelBuilderTextContent}>
                    <Text style={styles.angelBuilderTitle}>
                      Angel Builder Dashboard
                    </Text>
                    <Text style={styles.angelBuilderDescription}>
                      View your network insights and performance metrics
                    </Text>
                  </View>

                  <WebSafeIcon name="ChevronRight" size={20} color={theme.colors.text.tertiary} />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Account Status */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Account Status</Text>
            <View style={styles.infoCard}>
              {accountInfo.map((info, index) => {
                const isActive = info.isStatus && info.value === 'Active';
                const isVerified = info.isVerified;
                const valueColor = info.isStatus
                  ? (isActive ? theme.colors.success : theme.colors.warning)
                  : info.isVerified !== undefined
                    ? (isVerified ? theme.colors.success : theme.colors.warning)
                    : theme.colors.text.primary;

                return (
                  <View key={index} style={[styles.infoRow, index === accountInfo.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.infoIconContainer}>
                      <WebSafeIcon name={info.icon} size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>
                        {info.label}
                      </Text>
                      <Text style={[styles.infoValue, { color: valueColor }]}>
                        {info.value}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* User Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoCard}>
              {userInfo.map((info, index) => {
                return (
                  <View key={index} style={[styles.infoRow, index === userInfo.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.infoIconContainer}>
                      <WebSafeIcon name={info.icon} size={16} color={theme.colors.primary} />
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

          {/* Address Information */}
          {currentUser?.address && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Address</Text>
              <View style={styles.infoCard}>
                {currentUser.address.address && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <WebSafeIcon name="Home" size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Street Address</Text>
                      <Text style={styles.infoValue}>{currentUser.address.address}</Text>
                    </View>
                  </View>
                )}
                {currentUser.address.city && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <WebSafeIcon name="MapPin" size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>City</Text>
                      <Text style={styles.infoValue}>{currentUser.address.city}</Text>
                    </View>
                  </View>
                )}
                {currentUser.address.postcode && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <WebSafeIcon name="MapPin" size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Postcode</Text>
                      <Text style={styles.infoValue}>{currentUser.address.postcode}</Text>
                    </View>
                  </View>
                )}
                {currentUser.address.country && (
                  <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                    <View style={styles.infoIconContainer}>
                      <WebSafeIcon name="Globe" size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Country</Text>
                      <Text style={styles.infoValue}>{currentUser.address.country}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Network Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Network & Rewards</Text>
            <View style={styles.infoCard}>
              {networkInfo.map((info, index) => {
                return (
                  <View key={index} style={[styles.infoRow, index === networkInfo.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.infoIconContainer}>
                      <WebSafeIcon name={info.icon} size={16} color={theme.colors.primary} />
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
                  <View style={styles.courseItemContainer}>
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
                    {currentUser.metahealers_expiry_date && (
                      <Text style={styles.expiryText}>
                        Expires: {formatFullDate(currentUser.metahealers_expiry_date)}
                      </Text>
                    )}
                  </View>
                )}
                {currentUser?.john_course_status && (
                  <View style={styles.courseItemContainer}>
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
                    {currentUser.john_course_expiry_date && (
                      <Text style={styles.expiryText}>
                        Expires: {formatFullDate(currentUser.john_course_expiry_date)}
                      </Text>
                    )}
                  </View>
                )}
                {currentUser?.naha_intro_status && (
                  <View style={styles.courseItemContainer}>
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
                    {currentUser.naha_intro_expiry_date && (
                      <Text style={styles.expiryText}>
                        Expires: {formatFullDate(currentUser.naha_intro_expiry_date)}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Upline & Enroler Information */}
          {(currentUser?.upline || currentUser?.enroler) && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Network Connections</Text>

              {currentUser?.upline && (
                <View style={styles.networkCard}>
                  <View style={styles.networkHeader}>
                    <WebSafeIcon name="Users" size={18} color={theme.colors.primary} />
                    <Text style={styles.networkHeaderText}>Sponsor</Text>
                  </View>

                  <View style={styles.networkInfoRow}>
                    <View style={styles.networkAvatar}>
                      <Text style={styles.networkAvatarText}>
                        {currentUser.upline.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.networkInfoContent}>
                      <Text style={styles.networkName}>{currentUser.upline.name}</Text>
                      <Text style={styles.networkDetail}>Code: {currentUser.upline.referral_code}</Text>
                    </View>
                  </View>
                </View>
              )}

              {currentUser?.enroler && (
                <View style={[styles.networkCard, { marginTop: theme.spacing.sm }]}>
                  <View style={styles.networkHeader}>
                    <WebSafeIcon name="UserPlus" size={18} color={theme.colors.primary} />
                    <Text style={styles.networkHeaderText}>Enroler</Text>
                  </View>

                  <View style={styles.networkInfoRow}>
                    <View style={styles.networkAvatar}>
                      <Text style={styles.networkAvatarText}>
                        {currentUser.enroler.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.networkInfoContent}>
                      <Text style={styles.networkName}>{currentUser.enroler.name}</Text>
                      <Text style={styles.networkDetail}>Code: {currentUser.enroler.referral_code}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Settings Menu */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsCard}>
              {menuItems.map((item, index) => {
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
                        <WebSafeIcon name={item.icon} size={18} color={theme.colors.primary} />
                      </View>
                      
                      <View style={styles.menuTextContent}>
                        <Text style={styles.menuTitle}>
                          {item.title}
                        </Text>
                        <Text style={styles.menuDescription}>
                          {item.description}
                        </Text>
                      </View>
                      
                      <WebSafeIcon name="ChevronRight" size={16} color={theme.colors.text.tertiary} />
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
                <WebSafeIcon name="LogOut" size={18} color={theme.colors.white} />
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
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    ...theme.shadows.elegant,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weights.medium,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.regular,
    letterSpacing: -0.1,
    lineHeight: 18,
  },
  courseSection: {
    marginBottom: theme.spacing.md,
  },
  courseStatusCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    ...theme.shadows.elegant,
  },
  courseItemContainer: {
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'capitalize',
    letterSpacing: 0,
  },
  expiryText: {
    fontSize: 10,
    color: theme.colors.text.tertiary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  settingsSection: {
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  settingsCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.elegant,
  },
  menuItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  signOutIcon: {
    backgroundColor: '#fecaca',
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: 2,
    letterSpacing: -0.1,
    lineHeight: 16,
  },
  menuDescription: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    lineHeight: 14,
  },
  itemSpacer: {
    height: theme.spacing.sm,
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    ...theme.shadows.elegant,
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutIconContainer: {
    marginRight: theme.spacing.sm,
  },
  signOutTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
    letterSpacing: -0.1,
  },
  appInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
  },
  appName: {
    fontSize: 11,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    letterSpacing: -0.1,
  },
  appVersion: {
    fontSize: 10,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  appTagline: {
    fontSize: 10,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  networkCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.elegant,
  },
  networkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  networkHeaderText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  networkInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  networkAvatarText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
    letterSpacing: -0.1,
  },
  networkInfoContent: {
    flex: 1,
  },
  networkName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.2,
  },
  networkDetail: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  networkSameAsUpline: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  angelBuilderSection: {
    marginBottom: theme.spacing.md,
  },
  angelBuilderCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.elegant,
  },
  angelBuilderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  angelBuilderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  angelBuilderTextContent: {
    flex: 1,
  },
  angelBuilderTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.2,
  },
  angelBuilderDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    lineHeight: 18,
  },
});

export default ProfileScreen;
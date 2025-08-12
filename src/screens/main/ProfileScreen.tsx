import React, { Fragment } from 'react';
import { Platform, Alert, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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

const ProfileScreen: React.FC<TabScreenProps<'Profile'>> = () => {
  const { user, logout } = useAuth();

  const userInfo = [
    {
      label: 'Email',
      value: user?.email || 'member@innerlight.community',
      icon: Mail
    },
    {
      label: 'Phone',
      value: user?.phone || '+1 (555) 123-4567',
      icon: Phone
    },
    {
      label: 'Location',
      value: user?.location || 'San Francisco, CA',
      icon: MapPin
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

  const getInitials = (name) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <Text style={styles.title}>Profile</Text>

          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(user?.name)}
                </Text>
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {user?.name || 'Member Name'}
                </Text>
                <Text style={styles.memberSince}>
                  Member since {new Date().getFullYear()}
                </Text>
                <Text style={styles.memberType}>
                  Wellness Community Member
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* User Information */}
            <View style={styles.userDetails}>
              {userInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <View key={index} style={styles.detailRow}>
                    <IconComponent size={16} color="#6b7280" />
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
                        <IconComponent size={20} color="#6b7280" />
                      </View>
                      
                      <View style={styles.menuText}>
                        <Text style={styles.menuTitle}>
                          {item.title}
                        </Text>
                        <Text style={styles.menuDescription}>
                          {item.description}
                        </Text>
                      </View>
                      
                      <ChevronRight size={20} color="#9ca3af" />
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
                <LogOut size={20} color="#dc2626" />
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
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#6366f1',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  memberSince: {
    fontSize: 14,
    color: '#6366f1',
    marginTop: 4,
    fontWeight: '500',
  },
  memberType: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  userDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  settingsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  signOutTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
  },
  signOutDescription: {
    fontSize: 14,
    color: '#ef4444',
  },
  itemSpacer: {
    height: 8,
  },
  signOutButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
  },
  appInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  appName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  appVersion: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProfileScreen;
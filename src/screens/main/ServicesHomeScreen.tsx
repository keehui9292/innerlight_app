import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { StackScreenProps } from '../../types';

// --- Theme Constants ---
const COLORS = {
  background: '#FAFAF9', // Warm off-white (Stone-50)
  surface: '#FFFFFF',
  primary: '#264653', // Deep Forest Green / Blue
  primaryLight: '#2A9D8F', // Muted Teal
  accent: '#E9C46A', // Sand/Gold
  text: '#1C1917', // Dark Charcoal
  textSecondary: '#78716C', // Stone Gray
  success: '#2A9D8F',
  lightGreen: '#E6F4F1',
  sand: '#F4F1DE',
};

const SHADOWS = {
  soft: {
    shadowColor: '#264653',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  glow: {
    shadowColor: '#2A9D8F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Interfaces ---
interface Service {
  id: string;
  title: string;
  icon: string;
  onPress?: () => void;
  isSpecial?: boolean;
}

interface FeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  imageColor: string;
}

type Props = StackScreenProps<any> & {
  navigation: any;
};

const ServicesHomeScreen: React.FC<Props> = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Simplified services data - colors handled by UI logic now for consistency
  const services: Service[] = [
    { id: 'service1', title: 'Meditate', icon: 'Brain' },
    { id: 'service2', title: 'Healing', icon: 'Heart' },
    { id: 'service3', title: 'Energy', icon: 'Zap' },
    { id: 'innerlight', title: 'InnerLight', icon: 'Sparkles', isSpecial: true },
    { id: 'service4', title: 'Growth', icon: 'TrendingUp' },
    { id: 'service5', title: 'Coaching', icon: 'Users' },
    { id: 'service6', title: 'Classes', icon: 'BookOpen' },
    { id: 'service7', title: 'Connect', icon: 'MessageCircle' },
  ];

  const bannerSlides = [
    { color: '#264653', label: 'Forest Wellness', sub: 'Reconnect with nature' },
    { color: '#2A9D8F', label: 'Daily Calm', sub: 'Find your center' },
    { color: '#E76F51', label: 'Vitality', sub: 'Boost your energy' },
  ];

  const featured: FeaturedItem[] = [
    {
      id: 'featured1',
      title: 'Morning Flow',
      subtitle: '10 min • Beginner',
      imageColor: '#F4F1DE',
    },
    {
      id: 'featured2',
      title: 'Deep Sleep',
      subtitle: '45 min • Meditation',
      imageColor: '#E6F4F1',
    },
    {
      id: 'featured3',
      title: 'Anxiety Release',
      subtitle: '20 min • Breathwork',
      imageColor: '#FDE4CF',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
          
          {/* Header & Search */}
          <View style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>Good Morning,</Text>
              <Text style={styles.usernameText}>Jessica</Text>
            </View>
            
            <View style={styles.searchContainer}>
              <WebSafeIcon name="Search" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Find peace, healing, clarity..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          {/* Balance Strip (Minimalist) */}
          <View style={styles.balanceSection}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceValue}>$52.30</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Spirit Points</Text>
              <View style={styles.pointsRow}>
                <WebSafeIcon name="Star" size={14} color={COLORS.accent} />
                <Text style={styles.pointsValue}>3,200</Text>
              </View>
            </View>
          </View>

          {/* Editorial Banner Slider */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannerScrollContent}
            style={styles.bannerContainer}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH * 0.8 + 16}
          >
            {bannerSlides.map((slide, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                style={[styles.bannerSlide, { backgroundColor: slide.color }]}
              >
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerSub}>{slide.sub}</Text>
                  <Text style={styles.bannerTitle}>{slide.label}</Text>
                  <View style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Explore</Text>
                  </View>
                </View>
                {/* Decorative Circle for visual interest */}
                <View style={[styles.decorativeCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Services Grid (Clean & Uniform) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <View style={styles.gridContainer}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  onPress={service.onPress}
                  style={[
                    styles.gridItem,
                    service.isSpecial && styles.gridItemSpecial
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.iconCircle,
                    service.isSpecial ? styles.iconCircleSpecial : styles.iconCircleRegular
                  ]}>
                    <WebSafeIcon
                      name={service.icon}
                      size={24}
                      color={service.isSpecial ? COLORS.surface : COLORS.primary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.gridLabel,
                      service.isSpecial && styles.gridLabelSpecial
                    ]}
                    numberOfLines={1}
                  >
                    {service.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Featured / Curated Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Curated for you</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScrollContent}
            >
              {featured.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={styles.featuredCard}
                >
                  <View style={[styles.featuredImagePlaceholder, { backgroundColor: item.imageColor }]}>
                    <WebSafeIcon name="PlayCircle" size={32} color={COLORS.primary + '80'} />
                  </View>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle}>{item.title}</Text>
                    <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },

  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerTextContainer: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  usernameText: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: '700', // Serif font would look great here if available
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 30, // Full pill shape
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...SHADOWS.soft,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.text,
    padding: 0, // Reset default padding
  },

  // Balance Section
  balanceSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    marginTop: 10,
    padding: 16,
    backgroundColor: COLORS.surface, // Or transparent
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5E5',
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '700',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsValue: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '700',
  },

  // Banner
  bannerContainer: {
    marginBottom: 32,
  },
  bannerScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  bannerSlide: {
    width: SCREEN_WIDTH * 0.8,
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 24,
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  decorativeCircle: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  bannerOverlay: {
    zIndex: 1,
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // Services Grid
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // Requires newer RN versions, otherwise use margin
  },
  gridItem: {
    width: (SCREEN_WIDTH - 40 - 48) / 4, // 4 columns with 16px gaps (3 gaps = 48px)
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  gridItemSpecial: {
    // No layout change, just semantic grouping
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  iconCircleRegular: {
    backgroundColor: COLORS.surface,
  },
  iconCircleSpecial: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.glow,
  },
  gridLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  gridLabelSpecial: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Featured
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  featuredScrollContent: {
    paddingRight: 20,
    gap: 16,
  },
  featuredCard: {
    width: 160,
    marginRight: 0,
  },
  featuredImagePlaceholder: {
    width: '100%',
    height: 110,
    borderRadius: 20,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredInfo: {
    paddingHorizontal: 4,
  },
  featuredTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerSpacer: {
    height: 40,
  },
});

export default ServicesHomeScreen;
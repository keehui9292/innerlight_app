import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../../constants/theme';

interface HeaderProps {
  /** The title to display in the center of the header. */
  title: string;
  /** A custom function to execute when the back button is pressed. Overrides the default navigation behavior. */
  onBackPress?: () => void;
  /** Set to `false` to hide the back button. Defaults to `true`. */
  showBackButton?: boolean;
  /** A React component to render on the right side of the header. */
  rightComponent?: React.ReactNode;
  /** Optional custom styles for the header container. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A reusable header component that ensures the title is always perfectly centered.
 * It uses a symmetrical three-column layout for consistent alignment.
 */
const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightComponent,
  style,
}) => {
  const navigation = useNavigation();

  /**
   * Handles the back button press. It executes the custom `onBackPress` function
   * if provided; otherwise, it attempts to navigate back in the stack.
   */
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* --- Left Container --- */}
      {/* This container acts as a spacer and holds the back button. */}
      <View style={styles.sideContainer}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* --- Center Container --- */}
      {/* This container expands to fill the available space and centers the title. */}
      <View style={styles.centerContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* --- Right Container --- */}
      {/* This container has the same width as the left one for symmetry and holds the right component. */}
      <View style={[styles.sideContainer, { alignItems: 'flex-end' }]}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes the side containers to the edges
    height: 60,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    ...theme.shadows.elegant,
    zIndex: 10,
  },
  /**
   * Container for the left and right actions.
   * Having a fixed width is crucial for keeping the title perfectly centered.
   */
  sideContainer: {
    width: 40,
    justifyContent: 'center',
  },
  /**
   * Container for the title text. It fills the remaining space
   * and centers its content.
   */
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
  },
  backButton: {
    // Negative margin visually aligns the icon to the edge while keeping a large tap area
    marginLeft: -theme.spacing.sm,
    padding: theme.spacing.sm,
  },
});

export default Header;
import React from 'react';
import { Platform, Text } from 'react-native';

interface WebSafeIconProps {
  name: string;
  size: number;
  color: string;
}

// Emoji fallback map (only used if lucide-react fails to load)
const emojiMap: Record<string, string> = {
  'Home': '🏠',
  'Calendar': '📅',
  'User': '👤',
  'MessageSquare': '💬',
  'Leaf': '🌿',
  'Star': '⭐',
  'ChevronRight': '▶',
  'CheckCircle': '✅',
  'Clock': '🕐',
  'Bell': '🔔',
  'ArrowLeft': '←',
  'Eye': '👁️',
  'EyeOff': '🙈',
  'Plus': '➕',
  'X': '❌',
  'Mail': '✉️',
  'Phone': '📞',
  'Settings': '⚙️',
  'Shield': '🛡️',
  'LogOut': '🚪',
  'Copy': '📄',
  'DollarSign': '💰',
  'Filter': '🔍',
  'MapPin': '📍',
  'FileText': '📝',
  'CreditCard': '💳',
  'XCircle': '❌',
  'AlertCircle': '⚠️',
  'Users': '👥',
  'UserPlus': '👤➕',
  'TrendingUp': '📈',
  'TrendingDown': '📉',
  'Award': '🏆',
  'BookOpen': '📖',
  'Activity': '📊',
  'GitBranch': '🌿',
  'CheckCircle': '✅'
};

const WebSafeIcon: React.FC<WebSafeIconProps> = ({ name, size, color }) => {
  if (Platform.OS === 'web') {
    // Use lucide-react for web browsers (proper SVG icons)
    try {
      const lucideReact = require('lucide-react');
      const IconComponent = lucideReact[name];
      
      if (IconComponent) {
        return <IconComponent size={size} color={color} />;
      }
    } catch (error) {
      console.warn(`Failed to load lucide-react icon: ${name}`, error);
    }
    
    // Fallback to emoji only if lucide-react fails
    return (
      <Text style={{ 
        fontSize: size, 
        color: color,
        lineHeight: size + 2,
        textAlign: 'center'
      }}>
        {emojiMap[name] || '•'}
      </Text>
    );
  }

  // On native platforms, use lucide-react-native
  try {
    const lucideReactNative = require('lucide-react-native');
    const IconComponent = lucideReactNative[name];
    
    if (IconComponent) {
      return <IconComponent size={size} color={color} />;
    }
  } catch (error) {
    console.warn(`Failed to load lucide-react-native icon: ${name}`, error);
  }

  // Final fallback to emoji
  return (
    <Text style={{ 
      fontSize: size, 
      color: color,
      lineHeight: size + 2,
      textAlign: 'center'
    }}>
      {emojiMap[name] || '•'}
    </Text>
  );
};

export default WebSafeIcon;
import React, { useState } from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import WebSafeIcon from '../common/WebSafeIcon';
import { theme } from '../../constants/theme';

interface SelectedImage {
  uri: string;
  filename: string;
  type?: string;
  size?: number;
}

interface ImageConfirmationModalProps {
  visible: boolean;
  images: SelectedImage[];
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onRemoveImage: (index: number) => void;
}

const ImageConfirmationModal: React.FC<ImageConfirmationModalProps> = ({
  visible,
  images,
  loading = false,
  onConfirm,
  onCancel,
  onRemoveImage,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleRemove = (index: number) => {
    onRemoveImage(index);
    // Reset selection if removed image was selected
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else if (selectedIndex !== null && selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onCancel}
            disabled={loading}
          >
            <WebSafeIcon name="X" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {images.length} Image{images.length !== 1 ? 's' : ''} Selected
          </Text>

          <View style={styles.closeButton} />
        </View>

        {/* Images Grid/List */}
        <ScrollView style={styles.imagesContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.imagesList}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageItem}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imageThumbnail}
                />

                <View style={styles.imageInfo}>
                  <Text style={styles.imageName} numberOfLines={1}>
                    {image.filename}
                  </Text>
                  <Text style={styles.imageSize}>
                    {formatFileSize(image.size)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(index)}
                  disabled={loading}
                >
                  <WebSafeIcon name="Trash2" size={20} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton, loading && styles.buttonDisabled]}
            onPress={onConfirm}
            disabled={loading || images.length === 0}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.confirmButtonText}>
                Share {images.length} Image{images.length !== 1 ? 's' : ''}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingTop: Platform.OS === 'web' ? theme.spacing.md : theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  imagesContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  imagesList: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  imageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.soft,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  imageInfo: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  imageName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  imageSize: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingBottom: Platform.OS === 'web' ? theme.spacing.md : theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  button: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  confirmButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.white,
  },
});

export default ImageConfirmationModal;

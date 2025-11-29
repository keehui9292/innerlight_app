import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
} from 'react-native';
import WebSafeIcon from '../common/WebSafeIcon';
import { theme } from '../../constants/theme';

interface Attachment {
  attachment_id: number;
  url: string;
  filename: string;
  type: 'photo' | 'video' | 'document' | 'file';
}

interface ImageGalleryModalProps {
  visible: boolean;
  images: Attachment[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
}) => {
  // Reset index when visible changes or images change
  const [currentIndex, setCurrentIndex] = useState(() => {
    return Math.min(initialIndex, Math.max(0, (images?.length || 1) - 1));
  });

  // Update index when initialIndex or images change
  useEffect(() => {
    if (visible && images && images.length > 0) {
      const newIndex = Math.min(initialIndex, images.length - 1);
      setCurrentIndex(Math.max(0, newIndex));
    }
  }, [initialIndex, images, visible]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images?.length]);

  const currentImage = images?.[currentIndex];
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Don't render if no images or no current image
  if (!images || images.length === 0 || !currentImage) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <WebSafeIcon name="X" size={28} color={theme.colors.white} />
        </TouchableOpacity>

        {/* Image Counter */}
        {images.length > 1 && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        )}

        {/* Image Display */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentImage.url }}
            style={{
              width: screenWidth,
              height: screenHeight,
              resizeMode: 'contain',
            }}
          />
        </View>

        {/* Image Filename */}
        <View style={styles.filenameContainer}>
          <Text style={styles.filename} numberOfLines={1}>
            {currentImage.filename}
          </Text>
        </View>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {/* Left Button */}
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonLeft]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <WebSafeIcon
                name="ChevronLeft"
                size={32}
                color={currentIndex === 0 ? theme.colors.text.light : theme.colors.white}
              />
            </TouchableOpacity>

            {/* Right Button */}
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonRight]}
              onPress={handleNext}
              disabled={currentIndex === images.length - 1}
            >
              <WebSafeIcon
                name="ChevronRight"
                size={32}
                color={currentIndex === images.length - 1 ? theme.colors.text.light : theme.colors.white}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  counterContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  counterText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filenameContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filename: {
    color: theme.colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
  navButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonLeft: {
    left: 20,
  },
  navButtonRight: {
    right: 20,
  },
});

export default ImageGalleryModal;

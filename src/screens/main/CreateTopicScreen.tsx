import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/Button';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';


interface CreateTopicScreenProps {
  navigation: any;
  route: any;
}

const CreateTopicScreen: React.FC<CreateTopicScreenProps> = ({ navigation, route }) => {
  const { topic: editingTopic } = route.params || {};
  const isEditing = !!editingTopic;

  const [title, setTitle] = useState<string>(editingTopic?.title || '');
  const [content, setContent] = useState<string>(editingTopic?.content?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || '');
  const [loading, setLoading] = useState<boolean>(false);



  const handleSubmit = async () => {
    if (!title.trim()) {
      if (Platform.OS === 'web') {
        alert('Please enter a title');
      } else {
        Alert.alert('Error', 'Please enter a title');
      }
      return;
    }

    if (!content.trim()) {
      if (Platform.OS === 'web') {
        alert('Please enter content');
      } else {
        Alert.alert('Error', 'Please enter content');
      }
      return;
    }


    try {
      setLoading(true);
      
      if (isEditing) {
        // Update existing topic
        const response = await ApiService.put(`/forum/topics/${editingTopic.id}`, {
          title: title.trim(),
          content: content.trim()
        });

        if (response.success) {
          if (Platform.OS === 'web') {
            alert('Topic updated successfully');
          } else {
            Alert.alert('Success', 'Topic updated successfully');
          }
          navigation.goBack();
        } else {
          throw new Error(response.message || 'Failed to update topic');
        }
      } else {
        // Create new topic
        const response = await ApiService.createTopic({
          title: title.trim(),
          content: content.trim()
        });

        if (response.success) {
          if (Platform.OS === 'web') {
            alert('Topic created successfully');
          } else {
            Alert.alert('Success', 'Topic created successfully');
          }
          navigation.goBack();
        } else {
          throw new Error(response.message || 'Failed to create topic');
        }
      }
    } catch (error: any) {
      console.error('Error submitting topic:', error);
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${isEditing ? 'update' : 'create'} topic`;
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header
        title={isEditing ? 'Edit Topic' : 'Create New Topic'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter topic title..."
              value={title}
              onChangeText={setTitle}
              maxLength={255}
            />
          </View>


          {/* Content Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Share your thoughts..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={12}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <CustomButton
            title={loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Topic' : 'Create Topic')}
            onPress={handleSubmit}
            disabled={loading}
            colorScheme="primary"
            fullWidth
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    ...Platform.select({
      web: { position: 'absolute', top: 70, bottom: 0, left: 0, right: 0 },
      default: { flex: 1 },
    }),
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    minHeight: 48,
    backgroundColor: theme.colors.white,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    minHeight: 200,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.white,
  },
});

export default CreateTopicScreen;
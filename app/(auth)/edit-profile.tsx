import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, authProfileTheme as styles } from '../../constants/Theme';
import Toast from 'react-native-toast-message';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('Jonathan Smith');
  const [email, setEmail] = useState('jonathansmith@workmail.com');
  const [phone, setPhone] = useState('+1 234 567 890');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save profile changes
      
      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30
      });
      
      router.back();
    } catch (error) {
      // Show error message
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update profile. Please try again.',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/avt4.jpg')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <ThemedText style={styles.changePhotoText}>Change Profile Photo</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              editable={!isSaving}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.saveButton, isSaving && { opacity: 0.7 }]} 
        onPress={handleSave}
        disabled={isSaving}
      >
        <ThemedText style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

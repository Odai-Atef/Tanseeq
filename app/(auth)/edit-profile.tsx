import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors } from '../../constants/Theme';
import { ProfileTheme } from '../../constants/ProfileTheme';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('Jonathan Smith');
  const [email, setEmail] = useState('jonathansmith@workmail.com');
  const [phone, setPhone] = useState('+1 234 567 890');

  const handleSave = () => {
    // TODO: Implement save functionality
    router.back();
  };

  return (
    <ThemedView style={ProfileTheme.container}>
    

      <ScrollView style={ProfileTheme.content}>
        <View style={ProfileTheme.profileSection}>
          <View style={ProfileTheme.avatarContainer}>
            <Image
              source={require('../../assets/images/avt4.jpg')}
              style={ProfileTheme.avatar}
            />
            <TouchableOpacity style={ProfileTheme.cameraButton}>
              <Ionicons name="camera-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <ThemedText style={ProfileTheme.changePhotoText}>Change Profile Photo</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={ProfileTheme.formSection}>
          <View style={ProfileTheme.inputGroup}>
            <ThemedText style={ProfileTheme.label}>Full Name</ThemedText>
            <TextInput
              style={ProfileTheme.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={ProfileTheme.inputGroup}>
            <ThemedText style={ProfileTheme.label}>Email Address</ThemedText>
            <TextInput
              style={ProfileTheme.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={ProfileTheme.inputGroup}>
            <ThemedText style={ProfileTheme.label}>Phone Number</ThemedText>
            <TextInput
              style={ProfileTheme.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={ProfileTheme.saveButton} onPress={handleSave}>
        <ThemedText style={ProfileTheme.saveButtonText}>Save Changes</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

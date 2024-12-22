import { Platform } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export const uploadFile = async (fileUri: string, token: string): Promise<string | null> => {
  try {
    const uri = Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri;
    
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    
    // Create payload with base64 data
    const payload = {
      type: 'image/jpeg',
      filename_download: 'uploaded-image.jpg',
      storage: "local",
      title: 'Base64 Image Upload',
      file: `data:image/jpeg;base64,${base64}`,
    };

    const response = await axios.post(API_ENDPOINTS.FILES, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Upload Success:', response.data);
    return response.data.data.id;
  } catch (error) {
    console.error('Upload Error:', error);
    return null;
  }
};

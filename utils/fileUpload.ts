import { Platform } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as mime from 'mime';

export const uploadFile = async (fileUri: string, token: string): Promise<string | null> => {
  try {
    const uri = Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri;
    
    // Create form data
    const formData = new FormData();
    
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Get file name and extension from URI
    const fileName = uri.split('/').pop() || 'upload';
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Get mime type
    const mimeType = mime.getType(fileExtension);
    if (!mimeType || !mimeType.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }
    
    // Create file object
    const file = {
      uri: uri,
      type: mimeType,
      name: fileName
    };
    
    // Append file to form data
    formData.append('file', file as any);

    const response = await axios.post(API_ENDPOINTS.FILES, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        
      },
    });

    console.log('Upload Success:', response.data);
    return response.data.data.id;
  } catch (error) {
    console.error('Upload Error:', error);
    return null;
  }
};

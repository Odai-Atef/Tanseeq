import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Footer } from '../components/Footer';
import { myTasksTheme as styles } from '../constants/MyTasksTheme';
import { colors } from '../constants/Theme';

export default function MyTasksScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.taskSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Total Tasks</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>

          <View style={styles.taskList}>
            <TouchableOpacity style={styles.taskItem}>
              <Text style={styles.taskTitle}>Define Problem with Client</Text>
              <Text style={styles.taskTime}>Saturday, 12:30 PM - 02:00 PM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.taskItem}>
              <Text style={styles.taskTitle}>Create Wireframe and User Flow</Text>
              <Text style={styles.taskTime}>Saturday, 02:30 PM - 04:00 PM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.taskItem}>
              <Text style={styles.taskTitle}>Project set up & Brief</Text>
              <Text style={styles.taskTime}>Saturday, 04:30 PM - 06:00 PM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer activeTab="my-tasks" />
    </View>
  );
}

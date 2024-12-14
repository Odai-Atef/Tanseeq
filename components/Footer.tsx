import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/Theme';

type FooterProps = {
  activeTab: 'home' | 'tasks' | 'profile' | 'calendar';
};

export function Footer({ activeTab }: FooterProps) {
  return (
    <View style={styles.footer}>
      <Link href="/dashboard" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons
            name={activeTab === 'home' ? 'grid' : 'grid-outline'}
            size={24}
            color={activeTab === 'home' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </Link>

     
      <Link href="/tasks/calendar" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons
            name={activeTab === 'calendar' ? 'calendar' : 'calendar-outline'}
            size={24}
            color={activeTab === 'calendar' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/task_add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </Link>

      <Link href="/tasks" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons
            name={activeTab === 'tasks' ? 'checkmark' : 'checkmark-outline'}
            size={24}
            color={activeTab === 'tasks' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/profile" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tab: {
    padding: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
});

import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { dashboardStyles as styles, colors } from '../constants/Theme';
import { Footer } from '../components/Footer';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProgressCircle = ({ progress }: { progress: number }) => {
  const size = 45;
  const strokeWidth = 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.progressCircle, localStyles.progressContainer]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.white}
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.white}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={[styles.progressText, localStyles.progressTextOverlay]}>{`${progress}%`}</Text>
    </View>
  );
};

const ProjectCard = ({ title, date, progress }: { title: string, date: string, progress: number }) => (
  <TouchableOpacity style={styles.projectCard}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Ionicons name="wallet-outline" size={24} color="#7980FF" />
      </View>
      <View style={styles.priorityBadge}>
        <Text style={styles.priorityText}>High</Text>
      </View>
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardMeta}>
      <View style={styles.metaItem}>
        <Ionicons name="calendar-outline" size={16} color="#464D61" />
        <Text style={styles.metaText}>{date}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{`${progress}%`}</Text>
    </View>
  </TouchableOpacity>
);

const TaskItem = ({ title, description, time, status }: { title: string, description: string, time: string, status: string }) => (
  <View style={styles.taskItem}>
    <View style={styles.taskHeader}>
      <Text style={styles.taskTitle}>{title}</Text>
      <Ionicons name="ellipsis-vertical" size={20} color="#464D61" />
    </View>
    <Text style={styles.taskDescription}>{description}</Text>
    <View style={styles.taskFooter}>
      <Text style={styles.taskTime}>{time}</Text>
      <View style={[styles.statusBadge, { backgroundColor: status === 'completed' ? '#E8F5E9' : '#E3F2FD' }]}>
        <Text style={[styles.statusText, { color: status === 'completed' ? '#4CAF50' : '#2196F3' }]}>
          {status}
        </Text>
      </View>
    </View>
  </View>
);

const localStyles = StyleSheet.create({
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextOverlay: {
    position: 'absolute',
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function Dashboard() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, User!</Text>
          <Text style={styles.subGreeting}>Let's complete your tasks</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressSection}>
          <ProgressCircle progress={85} />
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Progress Today Task</Text>
            <Text style={styles.progressSubtext}>13/15 Tasks Completed</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectsScroll}>
          <ProjectCard 
            title="Banking Platform Web & Mobile App"
            date="June 28, 2022"
            progress={78}
          />
          <ProjectCard 
            title="Education Web & App"
            date="June 15, 2022"
            progress={56}
          />
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <TaskItem 
          title="NFT Web & Mobile Apps"
          description="Create NFT website with necessary pages"
          time="10:00 AM - 03:00 PM"
          status="in progress"
        />
        <TaskItem 
          title="Shop Website & Mobile Apps"
          description="Create shop website with necessary pages"
          time="10:00 AM - 03:00 PM"
          status="completed"
        />
      </ScrollView>

      <Footer activeTab="home" />
    </ThemedView>
  );
}

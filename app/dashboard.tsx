import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Modal,
  Text,
} from "react-native";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { dashboardTheme as styles, colors } from "../constants/Theme";
import { Footer } from "../components/Footer";
import CircularProgress from "react-native-circular-progress-indicator";
import { router } from "expo-router";
import { Schedule } from "../types/Schedule";
import { TaskItem } from "../components/TaskItem";
import { useDashboard } from "../hooks/dashboardHooks";
import { useTranslation } from "../contexts/LanguageContext";
import { MyHomes } from "../components/MyHomes";
import { useHomes } from "../hooks/home/useHomes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Ionicons
      name="calendar-outline"
      size={48}
      color="#464D61"
      style={styles.emptyStateIcon}
    />
    <ThemedText style={styles.emptyStateText}>{message}</ThemedText>
  </View>
);

export default function Dashboard() {
  const [currentTourStep, setCurrentTourStep] = useState<number | null>(null);
  const [showTour, setShowTour] = useState(false);
  const { language } = useTranslation();
  
  // Tour steps
  const tourSteps = [
    { id: 1, target: "myHomes", text: "Each user has their own home. You can invite others to your home or join someone else's home. Click on a home to set it as your default." },
    { id: 2, target: "progressSection", text: "This progress bar shows your task completion status for today." },
    { id: 3, target: "taskSection", text: "Here you can see your most recent in-progress tasks, completed tasks, and tasks that haven't started yet." },
  ];
  
  useEffect(() => {
    checkTourStatus();
  }, []);
  
  const checkTourStatus = async () => {
    try {
      const completedTours = await AsyncStorage.getItem('completed_tours');
      const tours = completedTours ? JSON.parse(completedTours) : [];
      
      if (!tours.includes('dashboard')) {
        // Start tour after a short delay
        setTimeout(() => {
          startTour();
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  };
  
  const startTour = () => {
    setCurrentTourStep(1);
    setShowTour(true);
  };
  
  const nextStep = () => {
    if (currentTourStep && currentTourStep < tourSteps.length) {
      setCurrentTourStep(currentTourStep + 1);
    } else {
      completeTour();
    }
  };
  
  const completeTour = async () => {
    try {
      const completedTours = await AsyncStorage.getItem('completed_tours');
      let tours = completedTours ? JSON.parse(completedTours) : [];
      
      if (!tours.includes('dashboard')) {
        tours.push('dashboard');
        await AsyncStorage.setItem('completed_tours', JSON.stringify(tours));
      }
      
      setShowTour(false);
      setCurrentTourStep(null);
    } catch (error) {
      console.error('Error completing tour:', error);
    }
  };
  
  const getCurrentTourText = () => {
    if (!currentTourStep) return "";
    const step = tourSteps.find(step => step.id === currentTourStep);
    return step ? (language === 'ar' ? getArabicText(step.target) : step.text) : "";
  };
  
  const getArabicText = (target: string) => {
    switch(target) {
      case 'myHomes':
        return "لكل مستخدم منزله الخاص. يمكنك دعوة الآخرين إلى منزلك أو الانضمام إلى منزل شخص آخر. انقر على منزل لتعيينه كمنزلك الافتراضي.";
      case 'progressSection':
        return "يوضح شريط التقدم هذا حالة إكمال المهمة لهذا اليوم للمنزل المحدد.";
      case 'taskSection':
        return "هنا يمكنك رؤية أحدث المهام قيد التنفيذ والمهام المكتملة والمهام التي لم تبدأ بعد.";
      default:
        return "";
    }
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const {
    userName,
    schedules,
    firstInProgressSchedule,
    recentCompletedSchedule,
    waitingSchedule,
    progressPercentage,
    isLoading,
    error,
    fetchTodaySchedules,
  } = useDashboard();

  const { t, isRTL } = useTranslation();

  const { fetchHomes } = useHomes();
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchTodaySchedules(),
      fetchHomes()
    ]);
    setRefreshing(false);
  }, [fetchTodaySchedules, fetchHomes]);

  const renderTaskContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>
            {t("common.loading")}
          </ThemedText>
        </View>
      );
    }

    if (error) {
      return <EmptyState message={error} />;
    }

    if (schedules.length === 0) {
      return <EmptyState message={t("dashboard.noTasks")} />;
    }

    return (
      <>
        {firstInProgressSchedule && (
          <TaskItem item={firstInProgressSchedule} type="schedule" />
        )}

        {recentCompletedSchedule && (
          <TaskItem item={recentCompletedSchedule} type="schedule" />
        )}
       
        {waitingSchedule && (
          <TaskItem item={waitingSchedule} type="schedule" />
        )}

        {!firstInProgressSchedule && !recentCompletedSchedule && (
          <EmptyState message={t("dashboard.noInProgress")} />
        )}
      </>
    );
  };

  return (
    <ThemedView style={[styles.container, styles.ios_boarder]}>
      <View
        style={[
          styles.header,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View style={{ flex: 1 }}>
          <View style={{ 
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center"
          }}>
            <ThemedText
              type="title"
              style={[styles.greeting, { textAlign: isRTL ? "right" : "left" }]}
            >
              {t("dashboard.greeting", { name: userName })}
            </ThemedText>
            
            <TouchableOpacity 
              style={[
                tourStyles.copilotIcon, 
                { marginRight: isRTL ? 10 : 0, marginLeft: isRTL ? 0 : 10 }
              ]}
              onPress={startTour}
            >
              <Ionicons
                name="help-circle"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          
          <ThemedText
            type="subtitle"
            style={[
              styles.subGreeting,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t("dashboard.subGreeting")}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View 
          style={[
            tourStyles.sectionContainer, 
            currentTourStep === 1 && tourStyles.highlightedSection
          ]}
        >
          <MyHomes />
        </View>

        <View 
          style={[
            styles.progressSection, 
            currentTourStep === 2 && tourStyles.highlightedSection
          ]}
        >
          <View style={[styles.progressCircle, { backgroundColor: "#7980FF" }]}>
            <CircularProgress
              value={progressPercentage}
              radius={25}
              duration={2000}
              progressValueColor={colors.white}
              activeStrokeColor={colors.white}
              inActiveStrokeColor={"rgba(255, 255, 255, 0.3)"}
              inActiveStrokeWidth={5}
              activeStrokeWidth={5}
              titleColor={colors.white}
              titleStyle={{ fontFamily: "Cairo", fontWeight: "600" }}
            />
          </View>
          <View style={styles.progressInfo}>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.progressTitle,
                { textAlign: isRTL ? "right" : "left", color: colors.white },
              ]}
            >
              {t("dashboard.progressTitle")}
            </ThemedText>
            <ThemedText
              style={[
                styles.progressSubtext,
                { textAlign: isRTL ? "right" : "left", color: colors.white },
              ]}
            >
              {t("dashboard.tasksCompleted", {
                completed: schedules
                  .filter((schedule: Schedule) =>
                    ["Done", "Cancelled"].includes(schedule.status)
                  )
                  .length.toString(),
                total: schedules.length.toString(),
              })}
            </ThemedText>
          </View>
        </View>

        <View 
          style={[
            tourStyles.sectionContainer, 
            currentTourStep === 3 && tourStyles.highlightedSection
          ]}
        >
          <View
            style={[
              styles.sectionHeader,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.sectionTitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {t("dashboard.todayTasks")}
            </ThemedText>
            <TouchableOpacity onPress={() => router.push("/tasks/calendar")}>
              <ThemedText type="link" style={styles.viewAll}>
                {t("common.buttons.viewAll")}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {renderTaskContent()}
        </View>
      </ScrollView>

      <Footer activeTab="home" />
      
      {/* Tour Modal */}
      {showTour && (
        <Modal
          transparent={true}
          visible={showTour}
          animationType="fade"
        >
          <View style={tourStyles.modalOverlay}>
            <View style={tourStyles.tooltipContainer}>
              <Text style={[
                tourStyles.tooltipText,
                language === 'ar' && tourStyles.tooltipTextRTL
              ]}>
                {getCurrentTourText()}
              </Text>
              <TouchableOpacity 
                style={tourStyles.nextButton}
                onPress={nextStep}
              >
                <Text style={tourStyles.nextButtonText}>
                  {currentTourStep === tourSteps.length 
                    ? (language === 'ar' ? 'إنهاء' : 'Finish') 
                    : (language === 'ar' ? 'التالي' : 'Next')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ThemedView>
  );
}

const tourStyles = StyleSheet.create({
  highlightedSection: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  tooltipText: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'left',
    fontFamily: 'Cairo',
  },
  tooltipTextRTL: {
    textAlign: 'right',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Cairo',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  copilotIcon: {
    padding: 5,
  },
});

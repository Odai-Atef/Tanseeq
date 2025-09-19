import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { dashboardTheme as styles, colors } from "../constants/Theme";
import { Footer } from "../components/Footer";
import CircularProgress from "react-native-circular-progress-indicator";
import { router, useFocusEffect } from "expo-router";
import { Schedule } from "../types/Schedule";
import { TaskItem } from "../components/TaskItem";
import { useDashboard } from "../hooks/dashboardHooks";
import { useTranslation } from "../contexts/LanguageContext";
import { MyHomes } from "../components/MyHomes";
import { useHomes } from "../hooks/home/useHomes";
import { getFCMToken } from "../utils/firebaseMessaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../constants/api";

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
  // Initialize with default values to prevent errors if context is not available yet
  const { t = (key: string, options?: any) => key, isRTL = false } = useTranslation() || {};
  const [refreshing, setRefreshing] = useState(false);
  const [fcmToken, setFcmToken] = useState<string>("");
  const lastRefreshTimeRef = useRef<number>(0);
  const isRefreshingRef = useRef<boolean>(false);
  
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getFCMToken();
        if (token) {
          setFcmToken(token);
          // Update the token in the one_signal column in the database
          const authToken = await AsyncStorage.getItem("access_token");
          if (authToken) {
            try {
              const response = await fetch(API_ENDPOINTS.USER_INFO, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  one_signal: token
                })
              });
              
              if (response.ok) {
                console.log("Token updated successfully in one_signal column");
              } else {
                console.error("Failed to update token in one_signal column:", await response.text());
              }
            } catch (updateError) {
              console.error("Error updating token in one_signal column:", updateError);
            }
          }
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };
    
    getToken();
  }, []);
  
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

  const { fetchHomes } = useHomes();
  
  // Reload data when the dashboard screen comes into focus, with rate limiting
  useFocusEffect(
    React.useCallback(() => {
      // Check if we're already refreshing or if it's been less than 30 seconds since the last refresh
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
      
      if (isRefreshingRef.current || timeSinceLastRefresh < 30000) {
        // Skip refresh if we're already refreshing or refreshed recently
        return;
      }
      
      // Set refreshing flag
      isRefreshingRef.current = true;
      
      // Reload data when the screen is focused
      Promise.all([
        fetchTodaySchedules(),
        fetchHomes()
      ]).finally(() => {
        // Update last refresh time and clear refreshing flag
        lastRefreshTimeRef.current = Date.now();
        isRefreshingRef.current = false;
      });
      
      return () => {
        // Cleanup function (if needed)
      };
    }, [fetchTodaySchedules, fetchHomes])
  );
  
  const onRefresh = React.useCallback(async () => {
    // Skip if we're already refreshing
    if (isRefreshingRef.current) {
      return;
    }
    
    isRefreshingRef.current = true;
    setRefreshing(true);
    
    try {
      await Promise.all([
        fetchTodaySchedules(),
        fetchHomes()
      ]);
    } finally {
      lastRefreshTimeRef.current = Date.now();
      isRefreshingRef.current = false;
      setRefreshing(false);
    }
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
      <MyHomes></MyHomes>
        <View style={styles.progressSection}>
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

        <View>
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

      <View testID="footer">
        <Footer activeTab="home" />
      </View>
    </ThemedView>
  );
}

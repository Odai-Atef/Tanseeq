import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../constants/api";
import { Schedule } from "../types/Schedule";
import { eventEmitter, EVENTS } from "../utils/eventEmitter";
import { useLanguage } from "./useLanguage";
import Toast from "react-native-toast-message";

export const useDashboard = () => {
  const { t } = useLanguage();

  const [userName, setUserName] = useState("User");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [firstInProgressSchedule, setFirstInProgressSchedule] =
    useState<Schedule | null>(null);
  const [recentCompletedSchedule, setRecentCompletedSchedule] =
    useState<Schedule | null>(null);
    const [waitingSchedule, setwaitingSchedule] =
    useState<Schedule | null>(null);
    
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const fullName = [userInfo.first_name, userInfo.last_name]
          .filter(Boolean)
          .join(" ");
        setUserName(fullName || "User");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      Toast.show({
        type: "error",
        text1: t("common.toast.error"),
        text2: t("common.toast.fetch.userInfo"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
    }
  };

  const fetchTodaySchedules = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("access_token");
      const defaultHomeStr = await AsyncStorage.getItem("DEFAULT_HOME");
      const today = new Date().toLocaleString('en-CA');

      let url = `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*&filter[day][_eq]=${today}`;

      if (defaultHomeStr) {
        const defaultHome = JSON.parse(defaultHomeStr);
        url += `&filter[task][property_id][_eq]=${defaultHome.id}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch schedules");

      const data = await response.json();
      const todaySchedules = (data.data || []).map((item: any) =>
        Schedule.fromAPI(item)
      );
      setSchedules(todaySchedules);

      // Find first in-progress schedule
      const inProgressSchedule = todaySchedules.find(
        (schedule: Schedule) => schedule.status === "In-progress"
      );
      const inWaitingSchedule = todaySchedules.find(
        (schedule: Schedule) => schedule.status === "Not-Started"
      );
      setFirstInProgressSchedule(inProgressSchedule || null);

      // Find most recent completed schedule
      const completedSchedules = todaySchedules.filter(
        (schedule: Schedule) => schedule.status === "Done"
      );
      const mostRecentCompleted = completedSchedules.sort(
        (a: Schedule, b: Schedule) => {
          const dateA = a.task.date_updated
            ? new Date(a.task.date_updated).getTime()
            : 0;
          const dateB = b.task.date_updated
            ? new Date(b.task.date_updated).getTime()
            : 0;
          return dateB - dateA;
        }
      )[0];
      setRecentCompletedSchedule(mostRecentCompleted || null);
      setwaitingSchedule(inWaitingSchedule||null)
      // Calculate progress percentage
      const totalSchedules = todaySchedules.length;
      const activeSchedules = todaySchedules.filter((schedule: Schedule) =>
        ["Done", "Cancelled"].includes(schedule.status)
      ).length;

      const percentage =
        totalSchedules > 0
          ? Math.round((activeSchedules / totalSchedules) * 100)
          : 0;

      setProgressPercentage(percentage);
    } catch (error) {
      console.error("Error fetching today schedules:", error);
      setError("Failed to load schedules. Please try again later.");
      Toast.show({
        type: "error",
        text1: t("common.toast.error"),
        text2: t("common.toast.fetch.homes"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getUserInfo();
    fetchTodaySchedules();

    // Listen for default home changes
    const handleDefaultHomeChange = () => {
      fetchTodaySchedules();
    };

    eventEmitter.on(EVENTS.DEFAULT_HOME_CHANGED, handleDefaultHomeChange);

    return () => {
      eventEmitter.off(EVENTS.DEFAULT_HOME_CHANGED, handleDefaultHomeChange);
    };
  }, []);

  return {
    userName,
    schedules,
    firstInProgressSchedule,
    recentCompletedSchedule,
    waitingSchedule,
    progressPercentage,
    isLoading,
    error,
    fetchTodaySchedules,
  };
};

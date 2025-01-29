import { useState, useEffect } from "react";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Schedule } from "../../types/Schedule";
import { API_ENDPOINTS } from "../../constants/api";
import Toast from "react-native-toast-message";
import { useLanguage } from "../useLanguage";
interface ApiResponse {
  data: any[];
}

export const useCalendar = () => {
  const { t } = useLanguage();

  const [expandedSections, setExpandedSections] = useState({
    inProgress: true,
    done: true,
    notStarted: true,
  });
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const showError = () => {
    Toast.show({
      type: "error",
      text1: t("common.toast.error"),
      text2: t("common.error.general"),
      position: "top",
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 70,
    });
  };

  const fetchSchedules = async (date: string) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Toast.show({
          type: "error",
          text1: t("common.toast.auth.required"),
          text2: t("common.error.auth.required"),
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 70,
        });
        return;
      }

      const defaultHomeStr = await AsyncStorage.getItem("DEFAULT_HOME");
      let url = `${API_ENDPOINTS.SCHEDULE}?sort=task.name&fields=*,task.*&filter[day][_eq]=${date}`;

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

      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }

      const result: ApiResponse = await response.json();
      const scheduleInstances = (result.data || []).map((schedule) =>
        Schedule.fromAPI(schedule)
      );
      setSchedules(scheduleInstances);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: t("common.toast.error"),
        text2: t("common.toast.schedule.error.load"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
      console.error("Error fetching schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  const toggleSection = (section: "inProgress" | "done" | "notStarted") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const inProgressTasks = schedules.filter(
    (schedule) => schedule.status === "In-progress"
  );
  const doneTasks = schedules.filter((schedule) => schedule.status === "Done");
  const notStartedTasks = schedules.filter(
    (schedule) => schedule.status === "Not-Started"
  );

  return {
    expandedSections,
    selectedDate,
    schedules,
    loading,
    inProgressTasks,
    doneTasks,
    notStartedTasks,
    setSelectedDate,
    toggleSection,
    fetchSchedules,
  };
};

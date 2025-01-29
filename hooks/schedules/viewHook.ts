import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Schedule } from "../../types/Schedule";
import { API_ENDPOINTS } from "../../constants/api";
import { ADMIN_ROLE } from "../../constants/roles";
import { useTranslation } from "../../contexts/LanguageContext";
import Toast from "react-native-toast-message";
import { useLanguage } from "../../hooks/useLanguage";

interface ApiResponse {
  data: any[];
}

export const useScheduleView = (id: string | string[]) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await fetch(API_ENDPOINTS.USER_INFO, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user info");

        const userData = await response.json();
        setUserRole(userData.data.role);
        setUserInfo(userData.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*&filter[id][_eq]=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }

        const result: ApiResponse = await response.json();
        if (result.data && result.data.length > 0) {
          setSchedule(Schedule.fromAPI(result.data[0]));
        } else {
          throw new Error("Schedule not found");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load schedule";
        setError(errorMessage);
        Toast.show({
          type: "error",
          text1: t("common.toast.error"),
          text2: t("common.toast.schedule.error.load"),
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 70,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchedule();
    }
  }, [id]);

  const handleCancel = () => {
    Alert.alert(
      t("schedules.view.confirmations.cancel.title"),
      t("schedules.view.confirmations.cancel.message"),
      [
        {
          text: t("common.buttons.cancel"),
          style: "cancel",
        },
        {
          text: t("common.buttons.confirm"),
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("access_token");
              if (!token) throw new Error("No access token found");

              const response = await fetch(`${API_ENDPOINTS.SCHEDULE}/${id}`, {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: "Cancelled",
                }),
              });

              if (!response.ok) throw new Error("Failed to cancel schedule");

              Toast.show({
                type: "success",
                text1: t("common.toast.success"),
                text2: t("schedules.view.success.cancelled"),
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 70,
              });
              router.replace("/schedules" as any);
            } catch (error) {
              Toast.show({
                type: "error",
                text1: t("common.toast.error"),
                text2: t("schedules.view.error.cancel"),
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 70,
              });
              console.error("Error cancelling schedule:", error);
            }
          },
        },
      ]
    );
  };

  const handleStartTask = () => {
    Alert.alert(
      t("schedules.view.confirmations.start.title"),
      t("schedules.view.confirmations.start.message"),
      [
        {
          text: t("common.buttons.cancel"),
          style: "cancel",
        },
        {
          text: t("common.buttons.confirm"),
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("access_token");
              if (!token) throw new Error("No access token found");

              const response = await fetch(`${API_ENDPOINTS.SCHEDULE}/${id}`, {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: "In-progress",
                  start_at: new Date().toISOString(),
                }),
              });

              if (!response.ok) throw new Error("Failed to start task");

              Toast.show({
                type: "success",
                text1: t("common.toast.success"),
                text2: t("schedules.view.success.started"),
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 70,
              });
              router.replace("/tasks/calendar" as any);
            } catch (error) {
              Toast.show({
                type: "error",
                text1: t("common.toast.error"),
                text2: t("schedules.view.error.start"),
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 70,
              });
              console.error("Error starting task:", error);
            }
          },
        },
      ]
    );
  };

  const handleCloseTask = () => {
    Alert.alert(
      t("schedules.view.confirmations.close.title"),
      t("schedules.view.confirmations.close.message"),
      [
        {
          text: t("common.buttons.cancel"),
          style: "cancel",
        },
        {
          text: t("common.buttons.confirm"),
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("access_token");
              if (!token) throw new Error("No access token found");

              const response = await fetch(`${API_ENDPOINTS.SCHEDULE}/${id}`, {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: "Done",
                  end_at: new Date().toISOString(),
                }),
              });

              if (!response.ok) throw new Error("Failed to close task");

              Toast.show({
                type: "success",
                text1: t("common.toast.success"),
                text2: t("schedules.view.success.closed"),
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 70,
              });
              router.replace("/tasks/calendar" as any);
            } catch (error) {
              Toast.show({
                type: "error",
                text1: t("common.toast.error"),
                text2: t("schedules.view.error.close"),
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 70,
              });
              console.error("Error closing task:", error);
            }
          },
        },
      ]
    );
  };

  return {
    schedule,
    loading,
    error,
    userRole,
    handleCancel,
    handleStartTask,
    handleCloseTask,
    isAdmin: userRole === ADMIN_ROLE,
    userInfo,
  };
};

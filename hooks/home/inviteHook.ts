import { useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../../constants/api";
import Toast from "react-native-toast-message";
import { useLanguage } from "../useLanguage";

export const useInviteHome = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate random 6-digit numbers for home ID and password
  const homeId = useMemo(
    () => Math.floor(100000 + Math.random() * 900000).toString(),
    []
  );
  const homePassword = useMemo(
    () => Math.floor(100000 + Math.random() * 900000).toString(),
    []
  );
  const qrData = useMemo(
    () => `${API_ENDPOINTS.JOIN_HOME_DEEP}?aid=${homeId}&token=${homePassword}`,
    [homeId, homePassword]
  );

  const createOrUpdateHome = async () => {
    setIsSubmitting(true);
    try {
      var user = null;
      const userInfoStr = await AsyncStorage.getItem("userInfo");
      if (userInfoStr) {
        user = JSON.parse(userInfoStr);
      }
      const token = await AsyncStorage.getItem("access_token");
      if (!token || !user) {
        Toast.show({
          type: "error",
          text1: t("common.toast.auth.required"),
          text2: t("common.toast.auth.signInRequired"),
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 70,
        });
        return;
      }

      // Get existing home for the user
      const getResponse = await fetch(
        `${API_ENDPOINTS.HOME}?filter[id][_eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const homes = await getResponse.json();
      const existingHome = homes.data?.[0];

      const homeData = {
        auth_id: homeId,
        auth_token: homePassword,
        user_created: user.id,
      };

      let response;
      if (existingHome) {
        // Update existing home
        response = await fetch(`${API_ENDPOINTS.HOME}/${existingHome.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(homeData),
        });
      } else {
        // Create new home
        response = await fetch(API_ENDPOINTS.HOME, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(homeData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to create/update home");
      }

      Toast.show({
        type: "success",
        text1: t("common.toast.success"),
        text2: t("common.toast.defaultHome.success"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });

      return await response.json();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("common.toast.error"),
        text2: t("common.toast.defaultHome.error"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    homeId,
    homePassword,
    qrData,
    isSubmitting,
    createOrUpdateHome,
  };
};

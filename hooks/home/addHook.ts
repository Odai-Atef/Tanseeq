import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS, DEFAULT_HOME } from "../../constants/api";
import Toast from "react-native-toast-message";
import { useLanguage } from "../useLanguage";
import { Home } from "../../types/Home";
import { Member } from "../../types/Member";
import { eventEmitter, EVENTS } from "../../utils/eventEmitter";
import { Alert } from "react-native";

export const useHomeAdd = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useLocalSearchParams();
  const homeId = params.id as string | undefined;
  
  const [homeName, setHomeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [propertyUsers, setPropertyUsers] = useState<Member[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userCreated, setUserCreated] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  
  // Fetch home details if editing
  useEffect(() => {
    if (homeId) {
      setIsEditing(true);
      const fetchData = async () => {
        await fetchHomeDetails();
        fetchPropertyUsers();
        // getCurrentUser is now called inside fetchHomeDetails after setUserCreated
      };
      fetchData();
    }
  }, [homeId]);

  // Get current user info
  const getCurrentUser = async (createdUserId: string | null = null) => {
    try {
      const userInfoStr = await AsyncStorage.getItem("userInfo");
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        setCurrentUserId(userInfo.id);
        console.log(userInfo);
        
        // Use the passed createdUserId parameter if provided, otherwise fall back to state
        const effectiveUserCreated = createdUserId !== null ? createdUserId : userCreated;
        console.log(effectiveUserCreated);
        
        // Check if user is owner using the effective user created ID
        setIsOwner(userInfo.id === effectiveUserCreated || userInfo.id === homeId);
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };
  
  const fetchHomeDetails = async () => {
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
      
      const response = await fetch(`${API_ENDPOINTS.HOME}/${homeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch home details");
      }
      
      const data = await response.json();
      setHomeName(data.data.name);
      
      // Set userCreated state
      setUserCreated(data.data.user_created);
      
      // Only call getCurrentUser in edit mode, passing the user_created directly from the API response
      if (homeId) {
        getCurrentUser(data.data.user_created);
      }
      
      // Check if user is owner if we already have currentUserId
      if (currentUserId) {
        setIsOwner(currentUserId === data.data.user_created || currentUserId === homeId);
      }
      
      return data.data.user_created;
    } catch (error) {
      console.error("Error fetching home details:", error);
      Toast.show({
        type: "error",
        text1: t("common.toast.error"),
        text2: t("common.toast.fetch.homeDetails"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
    }
  };

  const fetchPropertyUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token || !homeId) return;
      
      const response = await fetch(`${API_ENDPOINTS.PROPERTY_USERS}?filter[properties_id][_eq]=${homeId}&fields=id,directus_users_id.*`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch property users");
      }
      
      const data = await response.json();
      console.log(data)
      const users = data.data.map((item: any) => ({
        id: item.id, // This is the property_user relationship ID
        user_id: item.directus_users_id.id,
        first_name: item.directus_users_id.first_name || "",
        last_name: item.directus_users_id.last_name || null,
        email: item.directus_users_id.email,
        avatar: item.directus_users_id.avatar || null,
        status: item.directus_users_id.status || "active"
      }));
      setPropertyUsers(users);
    } catch (error) {
      console.error("Error fetching home details:", error);
      Toast.show({
        type: "error",
        text1: t("common.toast.error"),
        text2: t("common.toast.fetch.homeDetails"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
    }
  };

  const validateHome = () => {
    if (!homeName.trim()) {
      return {
        isValid: false,
        errors: ["Home name is required"]
      };
    }
    return {
      isValid: true,
      errors: []
    };
  };

  const handleSubmit = async () => {
    const validation = validateHome();
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        Toast.show({
          type: "error",
          text1: t("common.toast.error"),
          text2: t("common.error.validation.required"),
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 70,
        });
      });
      return;
    }

    setIsSubmitting(true);

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
        setIsSubmitting(false);
        return;
      }

      // Get user info
      const userInfoStr = await AsyncStorage.getItem("userInfo");
      if (!userInfoStr) {
        Toast.show({
          type: "error",
          text1: t("common.toast.error"),
          text2: t("common.toast.fetch.userInfo"),
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 70,
        });
        setIsSubmitting(false);
        return;
      }
      
      const userInfo = JSON.parse(userInfoStr);

      if (isEditing && homeId) {
        // Update existing home
        const updateResponse = await fetch(`${API_ENDPOINTS.HOME}/${homeId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: homeName,
          }),
        });

        if (!updateResponse.ok) {
          throw new Error("Failed to update home");
        }
        
        // Update local storage if this is the default home
        const defaultHomeStr = await AsyncStorage.getItem(DEFAULT_HOME);
        if (defaultHomeStr) {
          const defaultHome = JSON.parse(defaultHomeStr);
          if (defaultHome.id === homeId) {
            defaultHome.name = homeName;
            await AsyncStorage.setItem(DEFAULT_HOME, JSON.stringify(defaultHome));
            // Emit event for default home change
            eventEmitter.emit(EVENTS.DEFAULT_HOME_CHANGED, defaultHome);
          }
        }
        
        Toast.show({
          type: "success",
          text1: t("common.toast.success"),
          text2: t("home.edit.success"),
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 70,
        });
      } else {
        // Create new home
        const homeResponse = await fetch(API_ENDPOINTS.HOME, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: homeName,
            status: "Active"
          }),
        });

        if (!homeResponse.ok) {
          throw new Error("Failed to create home");
        }

        const homeResult = await homeResponse.json();
        const newHomeId = homeResult.data.id;

        // Create property user relationship
        const propertyUserResponse = await fetch(API_ENDPOINTS.PROPERTY_USERS, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties_id: newHomeId,
            directus_users_id: userInfo.id,
            is_default: true,
            role: "admin"
          }),
        });

        if (!propertyUserResponse.ok) {
          throw new Error("Failed to create property user relationship");
        }

        // Create a Home object to save as default
        const newHome: Home = {
          id: newHomeId,
          name: homeName,
          date_created: new Date().toISOString(),
          is_default: true,
          property_users: [
            {
              id: userInfo.id,
              first_name: userInfo.first_name || "",
              last_name: userInfo.last_name || null,
              email: userInfo.email,
              avatar: userInfo.avatar || null,
              status: "active"
            }
          ],
          tasks: 0,
          links: 0,
          progress: 0
        };

        // Save as default home
        await AsyncStorage.setItem(DEFAULT_HOME, JSON.stringify(newHome));
        
        // Emit event for default home change
        eventEmitter.emit(EVENTS.DEFAULT_HOME_CHANGED, newHome);
        
        Toast.show({
          type: "success",
          text1: t("common.toast.success"),
          text2: t("home.add.success"),
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 70,
        });
      }

      setIsSubmitting(false);
      
      // Reset form
      setHomeName("");

      // Navigate back to homes page
      setTimeout(() => {
        router.push({ pathname: "/houses" });
      }, 1000);
    } catch (error) {
      console.error("Error creating home:", error);
      Toast.show({
        type: "error",
        text1: t("common.toast.error"),
        text2: t("home.add.error"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
      setIsSubmitting(false);
    }
  };

  const confirmDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      t("home.users.deleteConfirmation.title"),
      t("home.users.deleteConfirmation.message").replace("{name}", userName),
      [
        {
          text: t("common.buttons.cancel"),
          style: "cancel"
        },
        {
          text: t("common.buttons.confirm"),
          onPress: () => deletePropertyUser(userId)
        }
      ]
    );
  };

  const deletePropertyUser = async (propertyUserId: string) => {
    setIsDeleting(true);
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
        setIsDeleting(false);
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.PROPERTY_USERS}/${propertyUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete property user");
      }

      // Update the local state by removing the deleted user
      setPropertyUsers(prevUsers => prevUsers.filter(user => user.id !== propertyUserId));

      Toast.show({
        type: "success",
        text1: t("common.toast.success"),
        text2: t("home.users.deleteSuccess"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
    } catch (error) {
      console.error("Error deleting property user:", error);
      Toast.show({
        type: "error",
        text1: t("common.toast.error"),
        text2: t("home.users.deleteError"),
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    homeName,
    setHomeName,
    isSubmitting,
    handleSubmit,
    isEditing,
    propertyUsers,
    isDeleting,
    confirmDeleteUser,
    userCreated,
    homeId,
    isOwner
  };
};

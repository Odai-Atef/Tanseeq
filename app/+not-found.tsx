import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useTranslation } from "../contexts/LanguageContext";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  
  return (
    <>
      <ThemedView style={styles.container}>
        <Header title={t("notFound.title")} />
        <ThemedText style={styles.text} type="title">{t("notFound.message")}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{t("notFound.goHome")}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text:{
    marginTop:20,
    alignContent:"center",
    textAlign:"center"
  
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
        alignContent:"center",
    textAlign:"center"
  },
});

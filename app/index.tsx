import { storage } from "@/src/lib/mmkv";
import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = storage.getBoolean("isLoggedIn") ?? false;

  if (!isLoggedIn) {
    return <Redirect href="/(handyman-auth)/login" />;
  }

  return <Redirect href="/(handyman)/(tabs)" />;
}

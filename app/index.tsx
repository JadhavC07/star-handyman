import { useAuthStore } from "@/src/features/auth/auth.store";
import { storage } from "@/src/lib/mmkv";
import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = storage.getBoolean("isLoggedIn") ?? false;

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  const role = useAuthStore.getState().user?.role;
  if (role === "serviceman") {
    return <Redirect href="/(handyman)/(tabs)" />;
  }

  return <Redirect href="/(app)/(tabs)" />; 
}

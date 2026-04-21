import { useAuthStore } from "@/src/features/auth/auth.store";
import { storage } from "@/src/lib/mmkv";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const isLoggedIn = storage.getBoolean("isLoggedIn") ?? false;

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  const role = useAuthStore.getState().user?.role;
  if (role === "specialist") {
    return <Redirect href="/(handyman)/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    />
  );
}

import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import * as Network from "expo-network";

// React Query client with sane defaults for mobile
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnReconnect: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Online status management (RN)
onlineManager.setEventListener((setOnline) => {
  const unsubExpo: unknown = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return () => {
    // Support both shapes: function unsubscribe and EventSubscription with remove()
    const sub: any = unsubExpo as any;
    if (typeof sub === "function") return sub();
    if (sub && typeof sub.remove === "function") return sub.remove();
  };
});

export function RootProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const onAppStateChange = (status: AppStateStatus) => {
      focusManager.setFocused(status === "active");
    };
    const sub = AppState.addEventListener("change", onAppStateChange);
    return () => {
      sub.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

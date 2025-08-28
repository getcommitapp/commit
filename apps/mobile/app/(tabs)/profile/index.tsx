import { useEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import Constants from "expo-constants";

import { FormGroup, FormItem } from "@/components/ui/form";
import {
  spacing,
  ThemedText,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import CheckCircle from "@/assets/icons/check-circle.svg";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useAuth } from "@/lib/hooks/useAuth";
// Load react-native-maps lazily to avoid crashes in Expo Go where the native
// module isn't available. We'll import it at runtime and fall back gracefully.
import { Button } from "@/components/ui/Button";
import {
  getState,
  setAnchor,
  startBackgroundTracking,
  startForegroundTracking,
  stopBackgroundTracking,
  LocationConfig,
  type StayState,
} from "@/lib/location/service";
import { formatDuration, type LatLng } from "@/lib/location/utils";

// Minimal region type to avoid importing types from react-native-maps at build time
type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function ProfileScreen() {
  const success = useThemeColor({}, "success");
  const { user, loading: _loading, token: _token } = useAuth();
  const [state, setState] = useState<StayState>({
    anchor: null,
    lastPosition: null,
    inside: false,
    insideSince: null,
  });
  const [tick, setTick] = useState(0);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [mapModule, setMapModule] = useState<{
    MapView: any;
    Marker: any;
    Circle: any;
  } | null>(null);
  const [mapUnavailable, setMapUnavailable] = useState<string | null>(null);

  // Poll persisted state for UI updates (since background updates may arrive)
  useEffect(() => {
    let mounted = true;
    const interval = setInterval(async () => {
      const s = await getState();
      if (mounted) setState(s);
      setTick((t) => t + 1);
    }, 1000);
    (async () => {
      const s = await getState();
      if (mounted) setState(s);
    })();
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Start foreground + background tracking as the screen mounts
    (async () => {
      const fg = await startForegroundTracking();
      const bg = await startBackgroundTracking();
      setTrackingEnabled(!!(fg && bg));
    })();
    return () => {
      stopBackgroundTracking();
    };
  }, []);

  // Dynamically load react-native-maps (avoid crashing in Expo Go)
  useEffect(() => {
    let mounted = true;
    (async () => {
      // Skip loading maps in Expo Go (no native module). Requires dev build.
      const isExpoGo = Constants.appOwnership === "expo";
      if (Platform.OS === "web" || isExpoGo) {
        setMapUnavailable(
          isExpoGo
            ? "Map unavailable in Expo Go. Use a development build to enable maps."
            : "Map not available on web in this build"
        );
        return;
      }
      try {
        const m = await import("react-native-maps");
        if (!mounted) return;
        setMapModule({ MapView: m.default, Marker: m.Marker, Circle: m.Circle });
      } catch (e) {
        if (!mounted) return;
        setMapUnavailable("Map module failed to load.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const elapsedMs = useMemo(() => {
    return state.insideSince ? Date.now() - state.insideSince : 0;
  }, [state.insideSince, tick]);

  const region: Region | undefined = useMemo(() => {
    const center = state.lastPosition || state.anchor;
    if (!center) return undefined;
    return {
      latitude: center.latitude,
      longitude: center.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [state.lastPosition?.latitude, state.lastPosition?.longitude, state.anchor?.latitude, state.anchor?.longitude]);

  const center: LatLng | undefined = state.lastPosition || state.anchor || undefined;

  return (
    <ScreenLayout largeTitle>
      <FormGroup title="Location Challenge">
        <View style={{ height: 220, borderRadius: 12, overflow: "hidden" }}>
          {region && mapModule ? (
            <mapModule.MapView style={{ flex: 1 }} initialRegion={region} region={region}>
              {center && <mapModule.Marker coordinate={center} title="You" />}
              {state.anchor && (
                <>
                  <mapModule.Marker coordinate={state.anchor} pinColor={success} title="Anchor" />
                  <mapModule.Circle
                    center={state.anchor}
                    radius={LocationConfig.perimeterRadiusM}
                    strokeWidth={2}
                    strokeColor={success}
                    fillColor={success + "22"}
                  />
                </>
              )}
            </mapModule.MapView>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: useThemeColor({}, "card"),
              }}
            >
              <ThemedText style={textVariants.footnote}>
                {mapUnavailable ?? "Loading map..."}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={{ height: spacing.md }} />
        <FormItem label="Status" value={state.inside ? "Inside perimeter" : "Outside perimeter"} />
        <FormItem label="Timer" value={formatDuration(elapsedMs)} />
        <FormItem
          label="You have been at"
          value={
            center
              ? `${center.latitude.toFixed(5)}, ${center.longitude.toFixed(5)} for ${formatDuration(elapsedMs)}`
              : "Unknown location"
          }
        />
        <FormItem label="Tracking" value={trackingEnabled ? "On" : "Off"} />
        <View style={{ height: spacing.md }} />
        <Button
          title={state.anchor ? "Set anchor to current position" : "Set anchor here"}
          onPress={async () => {
            if (state.lastPosition) {
              await setAnchor(state.lastPosition);
              const s = await getState();
              setState(s);
            }
          }}
          variant="accent"
        />
      </FormGroup>
      <FormGroup title="Account">
        <FormItem label="Name" value={user?.name ?? "-"} />
        <FormItem label="Email" value={user?.email ?? "-"} />
      </FormGroup>

      <FormGroup title="Payment">
        <FormItem
          label="Status"
          value={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <CheckCircle width={18} height={18} color={success} />
              <ThemedText
                style={{
                  ...textVariants.bodyEmphasized,
                  color: success,
                }}
              >
                Active
              </ThemedText>
            </View>
          }
        />
        <FormItem
          label="Method"
          value="TWINT"
          navigateTo="/(tabs)/profile/method"
          testID="row-payment-method"
        />
      </FormGroup>
    </ScreenLayout>
  );
}

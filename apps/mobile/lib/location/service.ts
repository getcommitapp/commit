import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { distanceBetween, type LatLng } from "./utils";

// Public config — adjust perimeterRadiusM to change detection radius
export const LocationConfig = {
  taskName: "commit-background-location",
  // 100m default perimeter radius
  perimeterRadiusM: 100,
  // desired update interval in ms for background updates
  bgIntervalMs: 30_000,
  // foreground distance threshold in meters
  fgDistanceIntervalM: 5,
};

// Persisted keys
const STORAGE_KEYS = {
  anchor: "location.anchor", // LatLng JSON string
  insideSince: "location.insideSince", // number (ms epoch)
  lastPos: "location.lastPos", // LatLng JSON
};

export type StayState = {
  anchor: LatLng | null;
  lastPosition: LatLng | null;
  inside: boolean;
  insideSince: number | null; // epoch ms when user entered perimeter
};

export async function getState(): Promise<StayState> {
  const [a, s, p] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.anchor),
    AsyncStorage.getItem(STORAGE_KEYS.insideSince),
    AsyncStorage.getItem(STORAGE_KEYS.lastPos),
  ]);
  const anchor = a ? (JSON.parse(a) as LatLng) : null;
  const lastPosition = p ? (JSON.parse(p) as LatLng) : null;
  const insideSince = s ? Number(s) : null;
  const inside = Boolean(anchor && lastPosition && insideSince);
  return { anchor, lastPosition, inside, insideSince };
}

export async function setAnchor(anchor: LatLng | null) {
  if (anchor) await AsyncStorage.setItem(STORAGE_KEYS.anchor, JSON.stringify(anchor));
  else await AsyncStorage.removeItem(STORAGE_KEYS.anchor);
}

async function setLastPosition(pos: LatLng | null) {
  if (pos) await AsyncStorage.setItem(STORAGE_KEYS.lastPos, JSON.stringify(pos));
  else await AsyncStorage.removeItem(STORAGE_KEYS.lastPos);
}

async function setInsideSince(value: number | null) {
  if (value != null) await AsyncStorage.setItem(STORAGE_KEYS.insideSince, String(value));
  else await AsyncStorage.removeItem(STORAGE_KEYS.insideSince);
}

function computeInside(anchor: LatLng | null, pos: LatLng | null) {
  if (!anchor || !pos) return { inside: false, distance: Infinity };
  const d = distanceBetween(anchor, pos);
  return { inside: d <= LocationConfig.perimeterRadiusM, distance: d };
}

async function updateStateWithPosition(pos: LatLng) {
  const state = await getState();
  await setLastPosition(pos);
  const { inside } = computeInside(state.anchor, pos);
  if (inside) {
    if (!state.insideSince) await setInsideSince(Date.now());
  } else {
    await setInsideSince(null);
  }
}

// Background task definition (run even when app closed)
TaskManager.defineTask(LocationConfig.taskName, async ({ data, error }) => {
  if (error) {
    console.warn("Location task error:", error);
    return;
  }
  const locs = (data as any)?.locations as Location.LocationObject[] | undefined;
  const loc = locs?.[0];
  if (!loc) return;
  const pos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
  await updateStateWithPosition(pos);
});

// Foreground subscription (for immediate UI updates)
let fgSub: Location.LocationSubscription | null = null;

export async function startForegroundTracking() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) return false;
  if (fgSub) return true;
  fgSub = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5_000,
      distanceInterval: LocationConfig.fgDistanceIntervalM,
    },
    async (loc) => {
      const pos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      await updateStateWithPosition(pos);
    }
  );
  return true;
}

export async function stopForegroundTracking() {
  if (fgSub) {
    fgSub.remove();
    fgSub = null;
  }
}

export async function startBackgroundTracking() {
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  if (fg !== Location.PermissionStatus.GRANTED) return false;
  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  if (bg !== Location.PermissionStatus.GRANTED) return false;
  const isRegistered = await TaskManager.isTaskRegisteredAsync(LocationConfig.taskName);
  if (!isRegistered) {
    await Location.startLocationUpdatesAsync(LocationConfig.taskName, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: LocationConfig.bgIntervalMs,
      distanceInterval: 25,
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: false,
      // Android foreground service for background updates
      foregroundService: {
        notificationTitle: "Commit",
        notificationBody: "Tracking your location for challenges",
        notificationColor: "#00C2A2",
      },
    });
  }
  return true;
}

export async function stopBackgroundTracking() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(LocationConfig.taskName);
  if (isRegistered) await Location.stopLocationUpdatesAsync(LocationConfig.taskName);
}

// Keep foreground tracking aligned with app state
AppState.addEventListener("change", (state) => {
  if (state === "active") startForegroundTracking();
  else stopForegroundTracking();
});

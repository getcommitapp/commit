import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalActionResponseSchema,
  GoalMovementStartRequestSchema,
} from "@commit/types";
import { Accelerometer, Gyroscope } from "expo-sensors";

export function useLocalMovementTimer(goalId: string) {
  return useQuery<{ startedAt: string | null }>({
    queryKey: ["movement-timer", goalId],
    queryFn: async () => ({ startedAt: null }),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useMovementStart(goalId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const body = {};
      GoalMovementStartRequestSchema.parse(body);
      return apiFetch(
        `/goals/${goalId}/movement/start`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
        GoalActionResponseSchema
      );
    },
    onSuccess: () => {
      const nowIso = new Date().toISOString();
      const current = { startedAt: nowIso } as const;
      const key = ["movement-timer", goalId] as const;
      qc.setQueryData(key, current);
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// App no longer exposes stop; cancellation is handled programmatically by motion detection

export function useMovementViolation(goalId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return apiFetch(
        `/goals/${goalId}/movement/violate`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({}),
        },
        GoalActionResponseSchema
      );
    },
    onSettled: () => {
      // Clear local timer and refresh goals/groups
      qc.setQueryData(["movement-timer", goalId], { startedAt: null });
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// Simple motion detector combining accelerometer and gyroscope magnitudes.
// If motion exceeds thresholds while timer is active, trigger violation once.
export function useMovementWatcher(goalId: string, isActive: boolean) {
  const { mutate: violate, isPending } = useMovementViolation(goalId);
  const triggeredRef = useRef(false);

  useEffect(() => {
    let accelSub: any | null = null;
    let gyroSub: any | null = null;

    if (!isActive) {
      triggeredRef.current = false;
      Accelerometer.removeAllListeners();
      Gyroscope.removeAllListeners();
      return;
    }

    // Reasonable UI rate; we just need coarse detection
    Accelerometer.setUpdateInterval(200);
    Gyroscope.setUpdateInterval(200);

    let accelMag = 0;
    let gyroMag = 0;

    const maybeTrigger = () => {
      if (triggeredRef.current || isPending) return;
      // Heuristics: accel in g's, gyro in rad/s
      const accelThreshold = 1.5; // ~0.2g shake/move
      const gyroThreshold = 0.1; // ~0.8 rad/s rotation

      if (accelMag > accelThreshold || gyroMag > gyroThreshold) {
        triggeredRef.current = true;
        violate();
      }
    };

    accelSub = Accelerometer.addListener(({ x, y, z }) => {
      accelMag = Math.sqrt(x * x + y * y + z * z);
      maybeTrigger();
    });
    gyroSub = Gyroscope.addListener(({ x, y, z }) => {
      gyroMag = Math.sqrt(x * x + y * y + z * z);
      maybeTrigger();
    });

    return () => {
      accelSub && accelSub.remove();
      gyroSub && gyroSub.remove();
      accelSub = null;
      gyroSub = null;
    };
  }, [goalId, isActive, isPending, violate]);
}

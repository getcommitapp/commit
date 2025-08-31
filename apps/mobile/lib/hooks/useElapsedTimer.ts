import { useEffect, useMemo, useRef, useState } from "react";

export interface UseElapsedTimerOptions {
  intervalMs?: number;
  durationMs?: number | null; // when provided, exposes countdown helpers
  onComplete?: () => void; // called once when remaining reaches 0
}

export interface UseElapsedTimerResult {
  elapsedLabel: string | null;
  elapsedMs: number | null;
  isRunning: boolean;
  remainingMs: number | null;
  remainingLabel: string | null;
}

function formatHms(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function useElapsedTimer(
  startedAt: string | number | Date | null | undefined,
  options?: UseElapsedTimerOptions
): UseElapsedTimerResult {
  const { intervalMs = 1000, durationMs = null, onComplete } = options ?? {};

  const startTimeMs = useMemo(() => {
    if (!startedAt) return null;
    const time = new Date(startedAt).getTime();
    return Number.isFinite(time) ? time : null;
  }, [startedAt]);

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const isRunning = startTimeMs != null;

  useEffect(() => {
    if (!isRunning) return;
    setNowMs(Date.now());
    timerIdRef.current = setInterval(() => {
      setNowMs(Date.now());
    }, intervalMs);
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [isRunning, intervalMs]);

  const elapsedMs = useMemo(() => {
    if (!isRunning || startTimeMs == null) return null;
    return Math.max(0, nowMs - startTimeMs);
  }, [isRunning, nowMs, startTimeMs]);

  const elapsedLabel = useMemo(() => {
    if (elapsedMs == null) return null;
    return formatHms(elapsedMs);
  }, [elapsedMs]);

  const remainingMs = useMemo(() => {
    if (!isRunning || startTimeMs == null || durationMs == null) return null;
    return Math.max(0, durationMs - (nowMs - startTimeMs));
  }, [isRunning, startTimeMs, nowMs, durationMs]);

  const remainingLabel = useMemo(() => {
    if (remainingMs == null) return null;
    return formatHms(remainingMs);
  }, [remainingMs]);

  useEffect(() => {
    if (remainingMs == null || durationMs == null) return;
    if (remainingMs === 0 && !completedRef.current) {
      completedRef.current = true;
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      onComplete?.();
    }
  }, [remainingMs, durationMs, onComplete]);

  return { elapsedLabel, elapsedMs, isRunning, remainingMs, remainingLabel };
}

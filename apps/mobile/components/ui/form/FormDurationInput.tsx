import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View, Keyboard, Platform } from "react-native";
import { spacing, useThemeColor } from "@/components/Themed";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { FormItem } from "./FormItem";

interface FormDurationInputProps {
  label: string;
  duration: Date | null;
  onChange: (date: Date) => void;
  testID?: string;
}

export function FormDurationInput({
  label,
  duration,
  onChange,
  testID,
}: FormDurationInputProps) {
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");

  const formEmitter = useMemo(() => {
    return (globalThis as any).__COMMIT_FORM_EMITTER__ || {};
  }, []) as {
    subscribe?: (listener: (sourceId?: string) => void) => () => void;
  };

  const [open, setOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;

  const pickerHeight = useMemo(() => {
    return 220;
  }, []);

  const normalizeDuration = (input: Date): Date => {
    const hours = input.getHours();
    const minutes = input.getMinutes();
    if (hours === 0 && minutes === 0) {
      const next = new Date(input);
      next.setMinutes(1);
      return next;
    }
    return input;
  };

  useEffect(() => {
    if (Platform.OS === "android") return;
    const durationMs = open ? 300 : 220;
    const bezier = Easing.bezier(0.2, 0.9, 0.1, 1);
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: open ? pickerHeight : 0,
        duration: durationMs,
        easing: bezier,
        useNativeDriver: false,
      }),
      Animated.timing(revealAnim, {
        toValue: open ? 1 : 0,
        duration: durationMs,
        easing: bezier,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, heightAnim, revealAnim, pickerHeight]);

  useEffect(() => {
    const unsubscribe = formEmitter.subscribe?.((sourceId?: string) => {
      if (sourceId !== testID) {
        setOpen(false);
      }
    });
    return unsubscribe;
  }, [formEmitter, testID]);

  const valueLabel = useMemo(() => {
    if (!duration) return "Required";
    try {
      const hours = duration.getHours().toString().padStart(2, "0");
      const minutes = duration.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return String(duration);
    }
  }, [duration]);

  return (
    <>
      <FormItem
        label={label}
        value={valueLabel}
        onPress={() => {
          Keyboard.dismiss();
          if (Platform.OS === "android") {
            DateTimePickerAndroid.open({
              mode: "time",
              display: "clock",
              value: duration ?? new Date(0, 0, 0, 0, 1, 0, 0),
              onChange: (event, selectedDate) => {
                if (event?.type === "dismissed") return;
                if (selectedDate) onChange(normalizeDuration(selectedDate));
              },
              testID: testID ? `${testID}-picker` : undefined,
            });
          } else {
            setOpen((v) => !v);
          }
        }}
        testID={testID}
      />

      {Platform.OS !== "android" && open && (
        <View
          style={{
            height: 0.5,
            marginTop: 0.5,
            backgroundColor: border,
            marginLeft: spacing.xl,
          }}
        />
      )}
      {Platform.OS === "ios" && (
        <Animated.View
          style={{
            height: heightAnim,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: spacing.xl,
              opacity: revealAnim,
              transform: [
                {
                  translateY: revealAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 0],
                  }),
                },
              ],
            }}
            pointerEvents={open ? "auto" : "none"}
          >
            {open ? (
              <DateTimePicker
                mode="countdown"
                display="spinner"
                textColor={text}
                value={duration ?? new Date(0, 0, 0, 0, 1, 0, 0)}
                minuteInterval={1}
                onChange={(event, selectedDate) => {
                  if (event?.type === "dismissed") return;
                  if (selectedDate) onChange(normalizeDuration(selectedDate));
                }}
                testID={testID ? `${testID}-picker` : undefined}
              />
            ) : null}
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View, Keyboard } from "react-native";
import { spacing, useThemeColor } from "@/components/Themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FormItem } from "./FormItem";

interface FormTimeInputProps {
  label: string;
  time: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  testID?: string;
}

export function FormTimeInput({
  label,
  time,
  onChange,
  placeholder,
  testID,
}: FormTimeInputProps) {
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

  useEffect(() => {
    const duration = open ? 300 : 220;
    const bezier = Easing.bezier(0.2, 0.9, 0.1, 1);
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: open ? pickerHeight : 0,
        duration,
        easing: bezier,
        useNativeDriver: false,
      }),
      Animated.timing(revealAnim, {
        toValue: open ? 1 : 0,
        duration,
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
    if (!time) return placeholder ?? "Optional";
    try {
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(time);
    }
  }, [time, placeholder]);

  return (
    <>
      <FormItem
        label={label}
        value={valueLabel}
        onPress={() => {
          Keyboard.dismiss();
          setOpen((v) => !v);
        }}
        testID={testID}
      />
      {open && (
        <View
          style={{
            height: 0.5,
            marginTop: 0.5,
            backgroundColor: border,
            marginLeft: spacing.xl,
          }}
        />
      )}
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
              mode="time"
              display="spinner"
              textColor={text}
              value={time ?? new Date()}
              onChange={(event, selectedDate) => {
                if (event?.type === "dismissed") return;
                if (selectedDate) onChange(selectedDate);
              }}
              testID={testID ? `${testID}-picker` : undefined}
            />
          ) : null}
        </Animated.View>
      </Animated.View>
    </>
  );
}

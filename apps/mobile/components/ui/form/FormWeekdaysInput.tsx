import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { spacing, textVariants, useThemeColor } from "@/components/Themed";
import { FormItem } from "./FormItem";

interface WeekdayDef {
  key: number;
  label: string;
  short: string;
}

const WEEKDAYS: WeekdayDef[] = [
  { key: 1, label: "Monday", short: "Mon" },
  { key: 2, label: "Tuesday", short: "Tue" },
  { key: 3, label: "Wednesday", short: "Wed" },
  { key: 4, label: "Thursday", short: "Thu" },
  { key: 5, label: "Friday", short: "Fri" },
  { key: 6, label: "Saturday", short: "Sat" },
  { key: 7, label: "Sunday", short: "Sun" },
];

interface FormWeekdaysInputProps {
  label: string;
  mask: number;
  onChange: (nextMask: number) => void;
  placeholder?: string;
  testID?: string;
}

export function FormWeekdaysInput({
  label,
  mask,
  onChange,
  placeholder,
  testID,
}: FormWeekdaysInputProps) {
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const mutedForeground = useThemeColor({}, "mutedForeground");

  const [open, setOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;

  const valueLabel = useMemo(() => {
    if (!mask) return placeholder ?? "Optional";
    const sel: string[] = [];
    for (let i = 0; i < 7; i++)
      if ((mask >> i) & 1) sel.push(WEEKDAYS[i].short);
    return sel.join(", ");
  }, [mask, placeholder]);

  // Shared emitter for outside-press close
  const formEmitter = useMemo(() => {
    return (globalThis as any).__COMMIT_FORM_EMITTER__ || {};
  }, []) as {
    subscribe?: (listener: (sourceId?: string) => void) => () => void;
  };

  useEffect(() => {
    const duration = open ? 250 : 200;
    const bezier = Easing.bezier(0.2, 0.9, 0.1, 1);
    const rows = WEEKDAYS.length;
    const rowHeight = 47; // approx row height
    const desiredHeight = open ? rows * rowHeight : 0;
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: desiredHeight,
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
  }, [open, heightAnim, revealAnim]);

  useEffect(() => {
    // Close when any other FormItem is pressed
    const unsubscribe = formEmitter.subscribe?.((sourceId?: string) => {
      if (sourceId !== testID) setOpen(false);
    });
    return unsubscribe;
  }, [formEmitter, testID]);

  const toggleDay = (dayKey: number) => {
    const bit = 1 << (dayKey - 1);
    const next = mask & bit ? mask & ~bit : mask | bit;
    onChange(next);
  };

  return (
    <>
      <FormItem
        label={label}
        value={valueLabel}
        onPress={() => setOpen((v) => !v)}
        testID={testID}
      />
      {open ? (
        <View
          style={{
            height: 0.5,
            marginTop: 0.5,
            backgroundColor: border,
            marginLeft: spacing.xl,
          }}
        />
      ) : null}
      <Animated.View
        style={{
          height: heightAnim,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
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
          {WEEKDAYS.map((d, index) => {
            const bit = 1 << (d.key - 1);
            const active = (mask & bit) !== 0;
            return (
              <View key={d.key}>
                <FormItem
                  label={d.label}
                  value={
                    active ? (
                      <Ionicons name="checkmark" size={20} color={text} />
                    ) : (
                      <Text
                        style={{
                          ...textVariants.body,
                          color: mutedForeground,
                        }}
                      >
                        {" "}
                      </Text>
                    )
                  }
                  onPress={() => toggleDay(d.key)}
                  testID={testID}
                />
                {index < WEEKDAYS.length - 1 ? (
                  <View
                    style={{
                      height: 0.5,
                      marginTop: 0.5,
                      backgroundColor: border,
                      marginLeft: spacing.xl,
                    }}
                  />
                ) : null}
              </View>
            );
          })}
        </Animated.View>
      </Animated.View>
    </>
  );
}

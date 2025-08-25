import React, { useState } from "react";
import { View, Pressable, ScrollView, StyleSheet } from "react-native";
import { Text, spacing, radii, useThemeColor, textVariants } from "@/components/Themed";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

type Verification = { id: string; title: string; description: string };

const VERIFICATIONS: Verification[] = [
  { id: "time-range", title: "Start Time - End Time", description: "Complete the task in the set time interval" },
  { id: "duration", title: "Duration", description: "Select the duration of the task" },
  { id: "time", title: "Time", description: "Do your task at a certain time" },
  { id: "location", title: "Location", description: "Complete the task at a certain location" },
  { id: "photo", title: "Photo Validation", description: "Send a picture to reviewers to validate the task" },
];

export default function CreateGoalStep2Screen() {
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const accent = useThemeColor({}, "accent");
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxl + 80, // leave space for button
        }}
      >
        <Text style={[textVariants.subheadline, { color: mutedForeground, marginBottom: spacing.sm }]}>Step 2 of 3</Text>
        <Text style={[textVariants.title3, { marginBottom: spacing.xl }]}>Custom Goal</Text>
        <Text style={[textVariants.caption1Emphasized, { color: mutedForeground, marginBottom: spacing.sm }]}>VERIFICATION METHODS</Text>
        <View>
          {VERIFICATIONS.map((v, idx) => {
            const isSelected = selected.includes(v.id);
            return (
            <Pressable
              key={v.id}
              onPress={() => toggle(v.id)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: card,
                  borderTopLeftRadius: idx === 0 ? radii.md : 0,
                  borderTopRightRadius: idx === 0 ? radii.md : 0,
                  borderBottomLeftRadius: idx === VERIFICATIONS.length - 1 ? radii.md : 0,
                  borderBottomRightRadius: idx === VERIFICATIONS.length - 1 ? radii.md : 0,
                  borderWidth: 1,
                  borderColor: isSelected ? accent : border,
                  borderTopWidth: idx === 0 ? 1 : 0,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.iconPlaceholder} />
              <View style={{ flex: 1 }}>
                <Text style={textVariants.subheadlineEmphasized}>{v.title}</Text>
                <Text
                  style={[
                    textVariants.caption1Emphasized,
                    { color: mutedForeground, marginTop: 2 },
                  ]}
                  numberOfLines={2}
                >
                  {v.description}
                </Text>
                {isSelected && (
                  <Text style={[textVariants.caption2Emphasized, { color: accent, marginTop: 2 }]}>Selected</Text>
                )}
              </View>
            </Pressable>
          );})}
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: spacing.headerContentInset,
          paddingBottom: insets.bottom + spacing.lg,
          paddingTop: spacing.md,
          backgroundColor: 'transparent',
        }}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => {
            if (selected.length === 0) return;
            router.push({ pathname: '/(tabs)/goals/configure', params: { methods: selected.join(',') } });
          }}
          style={({ pressed }) => [
            styles.nextButton,
            { backgroundColor: accent, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={textVariants.subheadlineEmphasized}>{selected.length ? 'Next Step  ›' : 'Select at least one'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: '#d0d4d8',
  },
  nextButton: {
    borderRadius: radii.lg,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
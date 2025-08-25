import React from "react";
import { View, Pressable, ScrollView, StyleSheet } from "react-native";
import { Text, spacing, radii, useThemeColor, textVariants } from "@/components/Themed";

type Template = {
  id: string;
  title: string;
  description: string;
  category: "custom" | "template";
};

const TEMPLATES: Template[] = [
  { id: "custom", title: "Custom Goal", description: "Create your own goal", category: "custom" },
  { id: "wake", title: "Wake Up Goal", description: "Prove you wake up at a specific time", category: "template" },
  { id: "nophone", title: "No-Phone Goal", description: "Do not use your phone for a set duration", category: "template" },
];

export default function CreateGoalScreen() {
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const mutedForeground = useThemeColor({}, "mutedForeground");

  const custom = TEMPLATES.filter(t => t.category === "custom");
  const templates = TEMPLATES.filter(t => t.category === "template");

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.headerContentInset,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxl,
      }}
    >
      <Text style={[textVariants.subheadline, { color: mutedForeground, marginBottom: spacing.sm }]}>Step 1 of 3</Text>
      <Section
        title="CUSTOM GOAL"
        items={custom}
        card={card}
        border={border}
        muted={mutedForeground}
      />
      <Section
        title="GOAL TEMPLATES"
        items={templates}
        card={card}
        border={border}
        muted={mutedForeground}
        style={{ marginTop: spacing.xl }}
      />
    </ScrollView>
  );
}

function Section({
  title,
  items,
  card,
  border,
  muted,
  style,
}: {
  title: string;
  items: Template[];
  card: string;
  border: string;
  muted: string;
  style?: any;
}) {
  return (
    <View style={style}>
      <Text style={[textVariants.caption1Emphasized, { color: muted }]}>{title}</Text>
      <View style={{ marginTop: spacing.sm }}>
        {items.map((item, idx) => (
          <Pressable
            key={item.id}
            onPress={() => {}}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: card,
                borderTopLeftRadius: idx === 0 ? radii.md : 0,
                borderTopRightRadius: idx === 0 ? radii.md : 0,
                borderBottomLeftRadius: idx === items.length - 1 ? radii.md : 0,
                borderBottomRightRadius: idx === items.length - 1 ? radii.md : 0,
                borderWidth: 1,
                borderColor: border,
                borderTopWidth: idx === 0 ? 1 : 0,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={styles.iconPlaceholder} />
            <View style={{ flex: 1 }}>
              <Text style={textVariants.subheadlineEmphasized}>{item.title}</Text>
              <Text
                style={[
                  textVariants.caption1Emphasized,
                  { color: muted, marginTop: 2 },
                ]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    gap: spacing.lg,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: "#d0d4d8",
  },
});
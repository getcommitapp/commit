import React, { useState } from "react";
import { View, Pressable } from "react-native";
import Card from "@/components/ui/Card";
import CardList from "@/components/ui/CardList";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Button } from "@/components/ui/Button";
import {
  spacing,
  ThemedText,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import { SmallText } from "@/components/ui/SmallText";
import { useRouter } from "expo-router";

type OptionKey = "location" | "photo" | "checkin" | "movement";

const optionOrder: OptionKey[] = ["location", "photo", "checkin", "movement"];

const optionMeta: Record<OptionKey, { title: string; description: string }> = {
  location: {
    title: "Location",
    description: "Verify you were at a specific place during a time window.",
  },
  photo: {
    title: "Photo Validation",
    description: "Take a selfie or scene photo as proof at the due time.",
  },
  checkin: {
    title: "Check-In",
    description: "Confirm completion by tapping a button at the right time.",
  },
  movement: {
    title: "Phone Movement",
    description: "Use motion sensors to verify activity (e.g., walk or run).",
  },
};

export default function CustomGoalValidationScreen() {
  const router = useRouter();
  const muted = useThemeColor({}, "muted");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");
  const [selected, setSelected] = useState<OptionKey | null>(null);

  return (
    <ScreenLayout style={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <SmallText>Validation Method</SmallText>
      <View style={{ gap: spacing.xs }}>
        {optionOrder.map((key) => {
          const isSelected = selected === key;
          return (
            <CardList key={key}>
              <Pressable
                onPress={() => setSelected((prev) => (prev === key ? null : key))}
                style={{
                  borderWidth: 1,
                  borderColor: isSelected ? primary : border,
                  borderRadius: 12,
                  opacity: isSelected ? 1 : 0.95,
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                testID={`goal-option-${key}`}
              >
                <Card
                  left={
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.lg,
                      }}
                    >
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          backgroundColor: muted,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        accessibilityLabel={`${key}-icon`}
                      >
                        {isSelected && (
                          <View
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 9,
                              backgroundColor: primary,
                            }}
                            accessibilityLabel="selected-indicator"
                          />
                        )}
                      </View>
                      <View style={{ gap: 4, flex: 1, minWidth: 0 }}>
                        <ThemedText style={textVariants.bodyEmphasized}>
                          {optionMeta[key].title}
                        </ThemedText>
                        <ThemedText style={textVariants.footnote}>
                          {optionMeta[key].description}
                        </ThemedText>
                      </View>
                    </View>
                  }
                />
              </Pressable>
            </CardList>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      <Button
        title="Next"
        size="lg"
        onPress={() =>
          router.push({
            pathname: "/(tabs)/goals/create/new",
            params: { method: selected ?? undefined },
          } as any)
        }
        disabled={!selected}
        style={{}}
      />
    </ScreenLayout>
  );
}

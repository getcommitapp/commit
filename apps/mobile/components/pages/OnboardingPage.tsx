import React from "react";
import { ImageSourcePropType, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Stack } from "expo-router";

import {
  ThemedText,
  useThemeColor,
  spacing,
  textVariants,
  typography,
  getLineHeight,
} from "@/components/Themed";
import { Button } from "@/components/ui/Button";

type Props = {
  image: ImageSourcePropType;
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
};

export default function OnboardingPage({
  image,
  title,
  description,
  buttonLabel,
  onPress,
}: Props) {
  const background = useThemeColor({}, "background");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const bodyFontSize = textVariants.body.fontSize as number;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: spacing.lg,
          }}
        >
          <Image
            source={image}
            style={{ width: 280, height: 280 }}
            contentFit="contain"
          />
          <ThemedText style={[textVariants.title1, { textAlign: "center" }]}>
            {title}
          </ThemedText>
          <ThemedText
            style={[
              textVariants.body,
              {
                textAlign: "center",
                color: mutedForeground,
                lineHeight: getLineHeight(
                  bodyFontSize,
                  typography.lineHeightRelaxed
                ),
              },
            ]}
          >
            {description}
          </ThemedText>
        </View>

        <Button title={buttonLabel} onPress={onPress} variant="accent" />
      </View>
    </SafeAreaView>
  );
}

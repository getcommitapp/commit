import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { FormGroup, FormInput } from "@/components/ui/form";
import { spacing, textVariants, ThemedText } from "@/components/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useJoinGroup } from "@/lib/hooks/useJoinGroup";

export default function JoinGroupScreen() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mutate, isPending, isError, error } = useJoinGroup();

  const canJoin = code.trim().length >= 4;

  const handleJoin = () => {
    mutate(code.trim().toUpperCase(), {
      onSuccess: () => router.back(),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", default: undefined })}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({
        ios: insets.top + 44,
        default: 0,
      })}
    >
      <ScrollView
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.lg,
          gap: spacing.lg,
          paddingBottom: insets.bottom,
        }}
      >
        <FormGroup title="Join Group">
          <FormInput
            label="Invitation Code"
            placeholder="Enter invite code"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            autoCapitalize="characters"
            returnKeyType="done"
          />
          {isError && (
            <ThemedText style={{ ...textVariants.subheadline, color: "red" }}>
              {(error as Error)?.message || "Failed to join"}
            </ThemedText>
          )}
        </FormGroup>
        <View style={{ flex: 1 }} />
        <Button
          title={isPending ? "Joining..." : "Join Group"}
          size="lg"
          disabled={!canJoin || isPending}
          onPress={handleJoin}
          style={{}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

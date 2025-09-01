import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { FormGroup, FormInput } from "@/components/ui/form";
import { textVariants, ThemedText } from "@/components/Themed";
import { useJoinGroup } from "@/lib/hooks/useJoinGroup";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

export default function JoinGroupScreen() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const { mutate, isPending, isError, error } = useJoinGroup();

  const canJoin = useMemo(() => code.trim().length === 6, [code]);

  const handleJoin = () => {
    mutate(code.trim().toUpperCase(), {
      onSuccess: () => router.back(),
    });
  };

  return (
    <ScreenLayout
      style={{ flexGrow: 1 }}
      fullscreen
      keyboardShouldPersistTaps="handled"
    >
      <FormGroup title="Join Group">
        <FormInput
          label="Invitation Code"
          placeholder="Enter invite code"
          value={code}
          onChangeText={(t) => setCode(t.toUpperCase())}
          autoCapitalize="characters"
          returnKeyType="done"
          maxLength={6}
          autoFocus
        />
        {isError && (
          <ThemedText style={{ ...textVariants.subheadline, color: "red" }}>
            {(error as Error)?.message || "Failed to join"}
          </ThemedText>
        )}
      </FormGroup>

      <View style={{ flex: 1 }} />

      <Button
        title="Join Group"
        size="lg"
        disabled={!canJoin || isPending}
        loading={isPending}
        onPress={handleJoin}
        style={{}}
      />
    </ScreenLayout>
  );
}

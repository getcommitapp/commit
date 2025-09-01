import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { FormGroup, FormInput } from "@/components/ui/form";
import { ThemedText, textVariants } from "@/components/Themed";
import { useCreateGroup } from "@/lib/hooks/useCreateGroup";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

export default function CreateGroupScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const { isPending, isError, error } = useCreateGroup();

  const canCreate = name.trim().length > 0; // description optional

  const handleNext = () => {
    const params = new URLSearchParams({
      forGroup: "1",
      groupName: name.trim(),
      groupDescription: description.trim() || "",
    });
    router.push(`/(tabs)/goals/create?${params.toString()}`);
  };

  return (
    <ScreenLayout
      style={{ flexGrow: 1 }}
      fullscreen
      keyboardShouldPersistTaps="handled"
    >
      <FormGroup title="Group">
        <FormInput
          label="Name"
          placeholder="Enter a group name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
          autoFocus
        />
        <FormInput
          label="Description"
          placeholder="Describe your group"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        {isError && (
          <ThemedText style={{ ...textVariants.subheadline, color: "red" }}>
            {(error as Error)?.message || "Failed to create group"}
          </ThemedText>
        )}
      </FormGroup>

      <View style={{ flex: 1 }} />
      <Button
        title="Next"
        size="lg"
        onPress={handleNext}
        disabled={!canCreate || isPending}
        loading={isPending}
        style={{}}
      />
    </ScreenLayout>
  );
}

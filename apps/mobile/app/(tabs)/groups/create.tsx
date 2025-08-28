import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { FormGroup, FormInput } from "@/components/ui/form";
import { spacing, ThemedText, textVariants } from "@/components/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateGroup } from "@/lib/hooks/useCreateGroup";

export default function CreateGroupScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { mutate, isPending, isError, error } = useCreateGroup();

  const canCreate = name.trim().length > 0; // description optional

  const handleCreate = () => {
    mutate(
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
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
        <FormGroup title="Group">
          <FormInput
            label="Name"
            placeholder="Enter a group name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
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
          title={isPending ? "Creating..." : "Create Group"}
          size="lg"
          onPress={handleCreate}
          disabled={!canCreate || isPending}
          style={{}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { FormGroup, FormInput } from "@/components/ui/form";
import { spacing } from "@/components/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateGroupScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const canCreate = name.trim().length > 0 && description.trim().length > 0;

  const handleCreate = () => {
    // TODO: Hook up API call. For now, just close modal.
    router.back();
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
        <FormGroup title="Name">
          <FormInput
            label="Title"
            placeholder="Enter a title"
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
        </FormGroup>

        <View style={{ flex: 1 }} />

        <Button
          title="Create Group"
          size="lg"
          onPress={handleCreate}
          disabled={!canCreate}
          style={{}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

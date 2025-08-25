import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text, spacing, useThemeColor, textVariants, radii } from '@/components/Themed';

export default function CreateGroupScreen() {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'mutedForeground');
  const accent = useThemeColor({}, 'accent');
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('John Doe');
  const [description, setDescription] = useState('johndoe28');
  const [editor, setEditor] = useState<'name' | 'description' | null>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior='automatic'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.headerContentInset, paddingTop: spacing.lg, paddingBottom: spacing.xxl + 100 }}
      >
        <Pressable onPress={() => router.back()} accessibilityRole='button' style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, marginBottom: spacing.md })}>
          <Text style={textVariants.subheadline}>cancel</Text>
        </Pressable>
        <Text style={[textVariants.title2, { marginBottom: spacing.xl }]}>Create Group</Text>
        <View style={{ backgroundColor: card, borderRadius: radii.md, overflow: 'hidden' }}>
          <Pressable
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1, borderBottomWidth: 1, borderColor: border }]}
            onPress={() => setEditor('name')}
            accessibilityRole='button'
          >
            <Text style={textVariants.subheadlineEmphasized}>Name</Text>
            <Text style={[textVariants.subheadline, { color: muted }]} numberOfLines={1}>{name}  ›</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => setEditor('description')}
            accessibilityRole='button'
          >
            <Text style={textVariants.subheadlineEmphasized}>Description</Text>
            <Text style={[textVariants.subheadline, { color: muted }]} numberOfLines={1}>{description}  ›</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.headerContentInset, paddingBottom: insets.bottom + spacing.lg, paddingTop: spacing.md }}>
        <Pressable
          style={({ pressed }) => [{ backgroundColor: accent, borderRadius: radii.lg, alignItems: 'center', paddingVertical: spacing.lg, opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.back()}
          accessibilityRole='button'
        >
          <Text style={textVariants.subheadlineEmphasized}>Next</Text>
        </Pressable>
      </View>
      <InlineEditor editor={editor} onClose={() => setEditor(null)} name={name} setName={setName} description={description} setDescription={setDescription} />
    </SafeAreaView>
  );
}

function InlineEditor({ editor, onClose, name, setName, description, setDescription }: any) {
  if (!editor) return null;
  const title = editor === 'name' ? 'Group Name' : 'Group Description';
  return (
    <Modal transparent animationType='fade' onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={textVariants.subheadlineEmphasized}>{title}</Text>
            <Pressable onPress={onClose}><Text style={textVariants.subheadlineEmphasized}>✕</Text></Pressable>
          </View>
          <TextInput
            autoFocus
            style={modalStyles.input}
            value={editor === 'name' ? name : description}
            onChangeText={(t) => editor === 'name' ? setName(t) : setDescription(t)}
            multiline={editor === 'description'}
          />
          <Pressable onPress={onClose} style={({ pressed }) => [modalStyles.doneBtn, { opacity: pressed ? 0.75 : 1 }]}>
            <Text style={textVariants.subheadlineEmphasized}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
});

const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: spacing.lg },
  container: { backgroundColor: '#fff', borderRadius: radii.lg, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: radii.md, padding: spacing.md, minHeight: 60, textAlignVertical: 'top' },
  doneBtn: { alignSelf: 'center', marginTop: spacing.lg, backgroundColor: '#eee', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radii.md },
});

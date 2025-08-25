import React from 'react';
import { ROUTES } from '@/constants/routes';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Text, spacing, textVariants, useThemeColor, radii } from '@/components/Themed';

export type Group = {
  id: string;
  name: string;
  amountCHF: number;
  startDate: string; // DD.MM.YYYY
  endDate: string;   // DD.MM.YYYY
  description: string;
  streak?: number;
};

export function GroupDetailContent({ group, origin }: { group: Group; origin?: 'home' | 'goals' | 'groups' }) {
  const muted = useThemeColor({}, 'mutedForeground');
  const accent = useThemeColor({}, 'accent');
  const danger = useThemeColor({}, 'danger');
  const card = useThemeColor({}, 'card');

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xxl }}
    >
      <Text style={[textVariants.title2, { marginBottom: spacing.xl }]}>{group.name}</Text>
      <View style={styles.twoColRow}>
        <View style={styles.colItem}>
          <Text style={[styles.label, { color: muted }]}>Start Date</Text>
          <Text style={textVariants.bodyEmphasized}>{group.startDate}</Text>
        </View>
        <View style={styles.colItem}>
          <Text style={[styles.label, { color: muted }]}>End Date</Text>
          <Text style={textVariants.bodyEmphasized}>{group.endDate}</Text>
        </View>
      </View>
      <View style={{ marginTop: spacing.xl }}>
        <Text style={[styles.label, { color: muted }]}>Your Financial Stake</Text>
        <Text style={[textVariants.bodyEmphasized, { marginTop: spacing.xs }]}>CHF {group.amountCHF}</Text>
      </View>
      <View style={{ marginTop: spacing.xl }}>
        <Text style={[styles.label, { color: muted }]}>Description</Text>
        <Text style={[textVariants.bodyEmphasized, { marginTop: spacing.xs }]}>
          {group.description}
        </Text>
      </View>
      <View style={{ marginTop: spacing.xl }}>
        <Text style={[styles.label, { color: muted }]}>Members</Text>
        <Text style={[textVariants.caption1Emphasized, { marginTop: spacing.xs, color: muted }]}>Coming soon</Text>
      </View>
      <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={textVariants.subheadlineEmphasized}>View Goal  ›</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => {
            const { router } = require('expo-router');
            if (origin === 'home') {
              router.push(ROUTES.HOME_GROUP_VERIFY as any);
            } else {
              router.push(ROUTES.GROUPS_VERIFY as any);
            }
          }}
        >
          <Text style={textVariants.subheadlineEmphasized}>Verify Now  ›</Text>
        </Pressable>
        <View style={styles.bottomRow}>
          <Pressable
            style={({ pressed }) => [
              styles.inviteButton,
              { backgroundColor: card, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[textVariants.caption1Emphasized, { color: muted }]}>Get invite link</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.leaveButton,
              { borderColor: danger, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={{ fontSize: 22, color: danger }}>📤</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

export default GroupDetailContent;

const styles = StyleSheet.create({
  twoColRow: { flexDirection: 'row', gap: spacing.xl },
  colItem: { flex: 1 },
  label: { ...textVariants.subheadline, fontWeight: '400', marginBottom: spacing.xs },
  primaryButton: {
    borderRadius: radii.lg,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  inviteButton: {
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
  leaveButton: {
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});

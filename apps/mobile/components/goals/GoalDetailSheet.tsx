import React from 'react';
import { ScrollView, View, Pressable, StyleSheet } from 'react-native';
import { Text, spacing, textVariants, useThemeColor, radii } from '@/components/Themed';

export type GoalStatus = 'active' | 'expired' | 'upcoming' | 'finished';
export type Goal = {
  id: string;
  title: string;
  amountCHF: number;
  status: GoalStatus;
  timeLeftHours?: number;
  groupName?: string;
  streak?: number;
};

export function GoalDetailContent({ goal, origin }: { goal: Goal; origin?: 'home' | 'goals' }) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedForeground = useThemeColor({}, 'mutedForeground');
  const danger = useThemeColor({}, 'danger');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const accent = useThemeColor({}, 'accent');

  const statusColor =
    goal.status === 'active'
      ? (goal.timeLeftHours ?? 0) <= 2
        ? danger
        : warning
      : goal.status === 'expired'
      ? danger
      : goal.status === 'finished'
      ? success
      : mutedForeground;
  const statusLabel =
    goal.status === 'active'
      ? `${goal.timeLeftHours} hours left`
      : goal.status;
  const startDate = '20.08.2025';
  const endDate = '20.09.2025';

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: spacing.xl }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: spacing.xxl, paddingTop: spacing.lg }}
    >
      <Text style={[textVariants.title2, { marginBottom: spacing.xl }]}>
        {goal.title}
      </Text>
      <View style={styles.sheetTwoColWrap}>
        <View style={styles.sheetField}>
          <Text style={[styles.sheetLabel, { color: mutedForeground }]}>Financial Stake</Text>
          <Text style={textVariants.bodyEmphasized}>CHF {goal.amountCHF}</Text>
        </View>
        <View style={styles.sheetField}>
          <Text style={[styles.sheetLabel, { color: mutedForeground }]}>Verification Window</Text>
          <Text style={textVariants.bodyEmphasized}>30 minutes</Text>
        </View>
        <View style={styles.sheetField}>
          <Text style={[styles.sheetLabel, { color: mutedForeground }]}>Start Date</Text>
          <Text style={textVariants.bodyEmphasized}>{startDate}</Text>
        </View>
        <View style={styles.sheetField}>
          <Text style={[styles.sheetLabel, { color: mutedForeground }]}>End Date</Text>
          <Text style={textVariants.bodyEmphasized}>{endDate}</Text>
        </View>
        <View style={styles.sheetField}>
          <Text style={[styles.sheetLabel, { color: mutedForeground }]}>If failed, stake goes to:</Text>
          <Text style={textVariants.bodyEmphasized}>App Developpers ❤️</Text>
        </View>
        <View style={styles.sheetField}>
          <Text style={[styles.sheetLabel, { color: mutedForeground }]}>Status</Text>
          <Text style={[textVariants.bodyEmphasized, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>
      <View style={{ marginTop: spacing.xl }}>
        <Text style={[styles.sheetLabel, { color: mutedForeground }]}>Description</Text>
        <Text style={[textVariants.bodyEmphasized, { marginTop: spacing.xs }]}>
          Complete a 30-minute workout session every morning before 9 AM.
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.verifyButton,
          {
            backgroundColor: accent,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        onPress={() => {
          // Dynamically navigate to verify screen in the same tab context
          // We only need the path; sheet parent will supply routing helper if needed.
          // Using window.location style navigation is not applicable; expo-router router imported lazily here to avoid circular.
          const { router } = require('expo-router');
          if (origin === 'home') {
            router.push('/(tabs)/home/verify');
          } else {
            router.push('/(tabs)/goals/verify');
          }
        }}
      >
        <Text style={[textVariants.subheadlineEmphasized]}>Verify Now  ›</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={() => {}}
        accessibilityLabel="Delete goal"
      >
        <Text style={{ fontSize: 24, color: danger }}>🗑️</Text>
      </Pressable>
    </ScrollView>
  );
}

export default GoalDetailContent;

const styles = StyleSheet.create({
  sheetTwoColWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.xl,
    rowGap: spacing.lg,
  },
  sheetField: { width: '45%' },
  sheetLabel: {
    ...textVariants.subheadline,
    fontWeight: '400',
    marginBottom: spacing.xs / 2,
  },
  verifyButton: {
    marginTop: spacing.xxl,
    borderRadius: radii.lg,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.xl,
  },
});

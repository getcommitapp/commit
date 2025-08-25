import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text, spacing, radii, useThemeColor, textVariants } from '@/components/Themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfigureGoalScreen() {
  const { template, methods } = useLocalSearchParams<{ template?: string; methods?: string }>();
  const verificationMethods = useMemo(() => (methods ? methods.split(',').filter(Boolean) : []), [methods]);
  const isTemplate = !!template;
  const templateId = template;
  const isCustom = !isTemplate;
  const insets = useSafeAreaInsets();

  const card = useThemeColor({}, 'card');
  const muted = useThemeColor({}, 'mutedForeground');
  const mutedBg = useThemeColor({}, 'muted');
  const border = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const warning = useThemeColor({}, 'warning');

  // Recurrence chips state
  const weekDays = ['M','T','W','T2','F','S','S2'] as const; // differentiate duplicate letters internally
  const dayLabels: Record<string,string> = { M:'M', T:'T', W:'W', T2:'T', F:'F', S:'S', S2:'S'};
  const [selectedDays, setSelectedDays] = useState<string[]>(['T']);
  const toggleDay = (d: string) => setSelectedDays(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);

  // Determine which fields show (same logic as earlier but for layout grouping)
  const showName = isTemplate ? templateId !== 'nophone' : true;
  const showStartDate = isTemplate || verificationMethods.some(m=>['time-range','duration','time'].includes(m));
  const showEndDate = showStartDate;
  const showRecurrence = isTemplate || verificationMethods.length>0;
  const showStartTime = (templateId === 'nophone') || verificationMethods.includes('time-range') || verificationMethods.includes('time');
  const showEndTime = (templateId === 'nophone') || verificationMethods.includes('time-range');
  const showDuration = verificationMethods.includes('duration');
  const showTimeSingle = verificationMethods.includes('time');
  const showLocation = verificationMethods.includes('location');
  const showPhoto = verificationMethods.includes('photo');
  const showStake = true;
  const showBeneficiary = true; // always for financial stake list group

  // Field component helpers
  const Pill = ({ label, value, onPress }: { label?: string; value: string; onPress?: ()=>void }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pill, { backgroundColor: mutedBg, opacity: pressed ? 0.85 : 1 }]}
    >
      <Text style={textVariants.subheadline}>{value}</Text>
    </Pressable>
  );

  const TwoCol = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.twoColRow}>{children}</View>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Text style={[textVariants.caption1Emphasized, { color: muted, marginBottom: spacing.xs }]}>{children}</Text>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.headerContentInset, paddingTop: spacing.lg, paddingBottom: spacing.xxl + 100 }}
      >
        {isCustom && (
          <Text style={[textVariants.subheadline, { color: muted, marginBottom: spacing.sm }]}>Step 3 of 3</Text>
        )}
        {/* Goal Name */}
        {showName && (
          <View style={{ marginBottom: spacing.xl }}>
            <Label>GOAL NAME</Label>
            <Pressable style={({ pressed }) => [styles.nameRow, { backgroundColor: card, borderColor: border, opacity: pressed ? 0.9 : 1 }]}>
              <Text style={textVariants.subheadlineEmphasized}>Name</Text>
              <Text style={[textVariants.subheadline, { color: muted }]}>Go to the gym  ›</Text>
            </Pressable>
          </View>
        )}
        {/* Dates */}
        {(showStartDate || showEndDate) && (
          <TwoCol>
            {showStartDate && (
              <View style={styles.colItem}>
                <Label>START DATE</Label>
                <Pill value="Apr 1, 2025" />
              </View>
            )}
            {showEndDate && (
              <View style={styles.colItem}>
                <Label>END DATE</Label>
                <Pill value="Apr 1, 2025" />
              </View>
            )}
          </TwoCol>
        )}
        {/* Recurrence */}
        {showRecurrence && (
          <View style={{ marginTop: spacing.xl }}>
            <Label>RECURRENCE</Label>
            <View style={styles.weekRow}>
              {weekDays.map(d => {
                const active = selectedDays.includes(d);
                return (
                  <Pressable
                    key={d}
                    onPress={() => toggleDay(d)}
                    style={({ pressed }) => [
                      styles.dayChip,
                      { backgroundColor: active ? border : mutedBg, opacity: pressed ? 0.85 : 1 },
                    ]}
                  >
                    <Text style={textVariants.subheadlineEmphasized}>{dayLabels[d]}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
        {/* Time Fields */}
        {(showStartTime || showEndTime) && (
          <TwoCol>
            {showStartTime && (
              <View style={styles.colItem}>
                <Label>START TIME</Label>
                <Pill value="08:15 AM" />
              </View>
            )}
            {showEndTime && (
              <View style={styles.colItem}>
                <Label>END TIME</Label>
                <Pill value="08:30 PM" />
              </View>
            )}
          </TwoCol>
        )}
        {(showDuration || showTimeSingle) && (
          <TwoCol>
            {showDuration && (
              <View style={styles.colItem}>
                <Label>DURATION</Label>
                <Pill value="00:00:00" />
              </View>
            )}
            {showTimeSingle && (
              <View style={styles.colItem}>
                <Label>TIME</Label>
                <Pill value="06:15 AM" />
              </View>
            )}
          </TwoCol>
        )}
        {(showLocation || showPhoto) && (
          <TwoCol>
            {showLocation && (
              <View style={styles.colItem}>
                <Label>LOCATION</Label>
                <Pill value="Select Location" />
              </View>
            )}
            {showPhoto && (
              <View style={styles.colItem}>
                <Label>PHOTO VALIDATION</Label>
                <Pill value="Enter a description" />
              </View>
            )}
          </TwoCol>
        )}
        {/* Financial Stake */}
        {(showStake || showBeneficiary) && (
          <View style={{ marginTop: spacing.xl }}>
            <Label>FINANCIAL STAKE (CHF)</Label>
            <View style={styles.listGroupWrapper}>
              <Pressable style={({ pressed }) => [styles.listRow, { backgroundColor: card, borderColor: border, borderTopLeftRadius: radii.md, borderTopRightRadius: radii.md, opacity: pressed ? 0.9 : 1 }]}>
                <Text style={textVariants.subheadlineEmphasized}>Stake</Text>
                <Text style={textVariants.subheadline}>10  ›</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.listRow, { backgroundColor: card, borderColor: border, borderBottomLeftRadius: radii.md, borderBottomRightRadius: radii.md, opacity: pressed ? 0.9 : 1, borderTopWidth: 0 }]}>
                <Text style={textVariants.subheadlineEmphasized}>Beneficiary</Text>
                <Text style={textVariants.subheadline}>Devs  ›</Text>
              </Pressable>
            </View>
            <Text style={[textVariants.caption1Emphasized, { color: warning, marginTop: spacing.md, textAlign: 'center', paddingHorizontal: spacing.md }]}>The amount above will be sent to the chosen beneficiary should you fail to complete the goal.</Text>
          </View>
        )}
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.headerContentInset, paddingBottom: insets.bottom + spacing.lg, paddingTop: spacing.md }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ backgroundColor: accent, borderRadius: radii.lg, alignItems: 'center', paddingVertical: spacing.lg, opacity: pressed ? 0.9 : 1 }]}
        >
          <Text style={textVariants.subheadlineEmphasized}>Create Goal  ›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderWidth: 1,
    borderRadius: radii.md,
  },
  twoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    gap: spacing.xl,
  },
  colItem: { flex: 1 },
  weekRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  dayChip: {
    width: 46,
    height: 46,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listGroupWrapper: { marginTop: spacing.sm },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderWidth: 1,
  },
});

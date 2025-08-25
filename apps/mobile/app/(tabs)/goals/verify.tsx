import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text, useThemeColor, spacing, radii, textVariants } from '../../../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';

export default function VerifyGoalScreen() {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'mutedForeground');
  const accent = useThemeColor({}, 'accent');
  const primary = useThemeColor({}, 'primary');
  const mutedBorder = border;
  const { origin } = useLocalSearchParams<{ origin?: string }>();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const methods = [
    { id: 'photo', label: 'Photo Proof' },
    { id: 'manual', label: 'Manual Entry' },
    { id: 'timer', label: 'Timer Session' },
  ];

  return (
    <View style={{ flex: 1, padding: spacing.xl, gap: spacing.xl }}>
      <View style={{ gap: 4 }}>
        <Text style={[textVariants.title2]}>Verify Goal</Text>
        <Text style={{ color: muted }}>Choose how you want to verify today.</Text>
      </View>

      <View style={{ gap: spacing.md }}>
        {methods.map((m) => {
          const active = selectedMethod === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setSelectedMethod(m.id)}
              style={{
                padding: spacing.lg,
                backgroundColor: card,
                borderWidth: 1,
                borderColor: active ? accent : mutedBorder,
                borderRadius: radii.lg,
              }}
            >
              <Text style={{ fontWeight: '500', fontSize: 16 }}>{m.label}</Text>
              {active && <Text style={{ color: accent, marginTop: 4 }}>Selected</Text>}
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: 'auto', gap: spacing.md }}>
        <Pressable
          disabled={!selectedMethod}
          onPress={() => {
            router.back();
          }}
          style={{
            padding: spacing.xl - 6,
            alignItems: 'center',
            backgroundColor: selectedMethod ? accent : card,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: selectedMethod ? accent : mutedBorder,
          }}
        >
          <Text style={{ color: selectedMethod ? primary : muted, fontWeight: '600', fontSize: 16 }}>Start Verification</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={{ alignItems: 'center', padding: spacing.sm }}>
          <Text style={{ color: muted }}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

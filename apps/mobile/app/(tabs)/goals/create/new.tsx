import React, { useState } from "react";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import {
  FormGroup,
  FormInput,
  FormSpacer,
  FormDateInput,
  FormTimeInput,
} from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { useCreateGoal } from "@/lib/hooks/useCreateGoal";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AndroidNativeProps, IOSNativeProps } from "@react-native-community/datetimepicker";
import { useThemeColor } from "@/components/Themed";

export default function GoalNewScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stake, setStake] = useState("");

  const [startAt, setStartAt] = useState<Date | null>(new Date());
  const [endAt, setEndAt] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  const createGoal = useCreateGoal();
  const router = useRouter();
  const params = useLocalSearchParams();
  const method = typeof params.method === "string" ? params.method : undefined;
  const [durationMinutes, setDuration] = useState<Date | null>(new Date(0, 0, 0, 0, 0, 0, 0));


  const onChangeStart: NonNullable<
    IOSNativeProps["onChange"] | AndroidNativeProps["onChange"]
  > = (_event, date) => {
    if (date) setStartAt(date);
  };

  const onChangeEnd: NonNullable<
    IOSNativeProps["onChange"] | AndroidNativeProps["onChange"]
  > = (_event, date) => {
    if (date) setEndAt(date);
  };

  return (
    <ScreenLayout keyboardShouldPersistTaps="handled">
      <FormGroup title="Details">
        <FormInput label="Title" value={title} onChangeText={setTitle} />
        <FormInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <FormInput
          label="Stake (CHF)"
          value={stake}
          onChangeText={setStake}
          keyboardType="numeric"
        />
      </FormGroup>

      <FormGroup title="Schedule">
        <FormDateInput
          label="Start date"
          date={startAt}
          onChange={(d) =>
            onChangeStart({ type: "set", nativeEvent: {} } as any, d)
          }
          testID="start-date"
        />
{/**        <FormDateInput
          label="End date"
          date={endAt}
          onChange={(d) =>
            onChangeEnd({ type: "set", nativeEvent: {} } as any, d)
          }
          minimumDate={startAt ?? undefined}
          placeholder="Optional"
          testID="end-date"
        />
*/}
      </FormGroup>

      <FormGroup title="Due time">
        <FormTimeInput
          label="Start time"
          time={startTime}
          onChange={(d) => setStartTime(d)}
          testID="start-time"
        />
        <FormTimeInput
          label="End time"
          time={endTime}
          onChange={(d) => setEndTime(d)}
          placeholder="Optional"
          testID="end-time"
        />
      </FormGroup>

      {/** Duration input<FormSpacer size="xl" /> */}

      {method && (method === "location" || method === "movement") && (
      <FormGroup title="Duration">
        <FormTimeInput
          label="Interval"
          time={durationMinutes}
          onChange={(d) => setDuration(d)}
          testID="interval"
        />
      </FormGroup>
      )}

      {/** Button section */}
      <Button
        title={createGoal.isPending ? "Creating..." : "Create Goal"}
        size="lg"
        onPress={() => {
          if (!startAt) return;
          const computedDurationMinutes =
            method && (method === "location" || method === "movement") && durationMinutes
              ? durationMinutes.getHours() * 60 + durationMinutes.getMinutes()
              : undefined;
          createGoal.mutate(
            {
              title,
              description,
              stake,
              startDate: startAt,
              endDate: endAt,
              dueStartTime: startTime,
              dueEndTime: endTime,
              verificationMethod: method
                ? {
                    method,
                    durationSeconds: computedDurationMinutes
                      ? computedDurationMinutes * 60
                      : undefined,
                  }
                : undefined,
            },
            {
              onSuccess: () => {
                router.back();
              },
            }
          );
        }}
        disabled={
          !title ||
          !startAt ||
          createGoal.isPending ||
          ((method === "location" || method === "movement") &&
            !(durationMinutes &&
              (durationMinutes.getHours() > 0 ||
                durationMinutes.getMinutes() > 0)))
        }
      />

      {createGoal.error && <FormSpacer size="md" />}
    </ScreenLayout>
  );
}

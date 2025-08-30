import React, { useState } from "react";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import {
  FormGroup,
  FormInput,
  FormSpacer,
  FormDateInput,
  FormTimeInput,
  FormDurationInput,
} from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { useCreateGoal } from "@/lib/hooks/useCreateGoal";
import { useCreateGroup } from "@/lib/hooks/useCreateGroup";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AndroidNativeProps,
  IOSNativeProps,
} from "@react-native-community/datetimepicker";

export default function GoalNewScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stake, setStake] = useState<number | null>(null);

  const [startAt, setStartAt] = useState<Date | null>(new Date());
  // const [endAt, setEndAt] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  const createGoal = useCreateGoal();
  const createGroup = useCreateGroup();
  const router = useRouter();
  const params = useLocalSearchParams();
  const method = typeof params.method === "string" ? params.method : undefined;
  const forGroup = params.forGroup === "1" || params.forGroup === "true";
  const groupName =
    typeof params.groupName === "string" ? params.groupName : "";
  const groupDescription =
    typeof params.groupDescription === "string" ? params.groupDescription : "";
  const [duration, setDuration] = useState<Date | null>(null);

  const onChangeStart: NonNullable<
    IOSNativeProps["onChange"] | AndroidNativeProps["onChange"]
  > = (_event, date) => {
    if (date) setStartAt(date);
  };

  // const onChangeEnd: NonNullable<
  //   IOSNativeProps["onChange"] | AndroidNativeProps["onChange"]
  // > = (_event, date) => {
  //   if (date) setEndAt(date);
  // };

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
          value={stake ?? ""}
          type="number"
          onChangeNumber={setStake}
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

      {/** Duration input */}
      {method && (method === "location" || method === "movement") && (
        <FormGroup title="Duration">
          <FormDurationInput
            label="Interval"
            duration={duration}
            onChange={(d) => setDuration(d)}
            testID="interval"
          />
        </FormGroup>
      )}

      {/** Button section */}
      <Button
        title={forGroup ? "Create Group" : "Create Goal"}
        size="lg"
        onPress={async () => {
          if (!startAt) return;
          const stakeCents =
            stake != null && Number.isFinite(stake)
              ? Math.round(stake * 100)
              : 0;
          if (stakeCents < 100) {
            return;
          }
          const computedDurationMinutes =
            method &&
            (method === "location" || method === "movement") &&
            duration
              ? duration.getHours() * 60 + duration.getMinutes()
              : undefined;

          if (forGroup) {
            await createGroup.mutateAsync({
              name: groupName || title,
              description: groupDescription || undefined,
              goal: {
                name: title,
                description: description || null,
                stakeCents,
                startDate: startAt.toISOString(),
                endDate: null,
                dueStartTime: (startTime ?? startAt).toISOString(),
                dueEndTime: endTime ? endTime.toISOString() : null,
                destinationType: "burn",
                verificationMethod: method
                  ? {
                      method: method as "location" | "movement",
                      durationSeconds: computedDurationMinutes
                        ? computedDurationMinutes * 60
                        : undefined,
                    }
                  : undefined,
              },
            });
            router.dismissAll();
            router.replace("/(tabs)/goals");
            router.replace("/(tabs)/groups/create");
            router.dismissAll();
          } else {
            await createGoal.mutateAsync({
              name: title,
              description: description || null,
              stakeCents,
              startDate: startAt.toISOString(),
              endDate: null,
              dueStartTime: (startTime ?? startAt).toISOString(),
              dueEndTime: endTime ? endTime.toISOString() : null,
              destinationType: "burn",
              verificationMethod: method
                ? {
                    method: method as "location" | "movement",
                    durationSeconds: computedDurationMinutes
                      ? computedDurationMinutes * 60
                      : undefined,
                  }
                : undefined,
            });
            router.dismissAll();
            router.replace("/(tabs)/goals");
          }
        }}
        disabled={
          !title ||
          !startAt ||
          createGoal.isPending ||
          createGroup.isPending ||
          !(
            stake != null &&
            Number.isFinite(stake) &&
            Math.round(stake * 100) >= 100
          )
        }
        loading={createGoal.isPending || createGroup.isPending}
      />

      {createGoal.error && <FormSpacer size="md" />}
    </ScreenLayout>
  );
}

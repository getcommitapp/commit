import React, { useState } from "react";
import { Alert } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import {
  FormDateInput,
  FormDurationInput,
  FormGroup,
  FormInput,
  FormSpacer,
  FormTimeInput,
  FormInputToggle,
  FormWeekdaysInput,
} from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { useCreateGoal } from "@/lib/hooks/useCreateGoal";
import { useCreateGroup } from "@/lib/hooks/useCreateGroup";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AndroidNativeProps,
  IOSNativeProps,
} from "@react-native-community/datetimepicker";
import { computeDurationMinutes, computeStakeCents } from "@/lib/utils";
import { useThemeColor } from "@/components/Themed";

export default function GoalNewScreen() {
  const danger = useThemeColor({}, "danger");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stake, setStake] = useState<number | null>(null);

  const [startAt, setStartAt] = useState<Date | null>(new Date());
  const [endAt, setEndAt] = useState<Date | null>(null);
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

  // Recurrence UI state
  const [isRecurring, setIsRecurring] = useState(false);
  const [recMask, setRecMask] = useState<number>(0);

  // Sync recMask when returning from weekdays modal
  if (typeof params.recMask === "string") {
    const parsed = parseInt(params.recMask, 10);
    if (Number.isFinite(parsed) && parsed !== recMask) {
      setRecMask(parsed);
    }
  }

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

  const computeMethodAndDuration = () => {
    if (!method)
      return {
        method: "checkin" as "location" | "movement" | "checkin" | "photo",
        durationSeconds: undefined as number | undefined,
      };
    if (method === "checkin" || method === "photo")
      return {
        method: method as "checkin" | "photo",
        durationSeconds: undefined,
      };
    const minutes = computeDurationMinutes(method, duration);
    return {
      method: method as "location" | "movement",
      durationSeconds: minutes ? minutes * 60 : undefined,
    };
  };

  const toHHmm = (d: Date | null): string | undefined => {
    if (!d) return undefined;
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const buildGoalPayload = (stakeCents: number) => {
    const { method: m, durationSeconds } = computeMethodAndDuration();
    if (isRecurring) {
      return {
        name: title,
        description: description || null,
        stakeCents,
        startDate: startAt?.toISOString() as string,
        endDate: endAt ? endAt.toISOString() : null,
        localDueStart: toHHmm(startTime ?? startAt)!,
        localDueEnd: endTime ? toHHmm(endTime)! : null,
        recDaysMask: recMask,
        destinationType: "burn" as const,
        method: m,
        durationSeconds,
      } as const;
    }
    return {
      name: title,
      description: description || null,
      stakeCents,
      startDate: startAt?.toISOString() as string,
      endDate: null as null,
      dueStartTime: (startTime ?? startAt)!.toISOString(),
      dueEndTime: endTime ? endTime.toISOString() : null,
      destinationType: "burn" as const,
      method: m,
      durationSeconds,
    } as const;
  };

  const handleCreate = async () => {
    if (!startAt) return;
    const stakeCents = computeStakeCents(stake);
    if (stakeCents < 100) return;

    // UI guard: prevent start time later than end time when both provided
    if (startTime && endTime && startTime.getTime() > endTime.getTime()) {
      return;
    }

    // UI guard: for recurrence, ensure end date is not before start date
    if (
      isRecurring &&
      endAt &&
      startAt &&
      endAt.getTime() < startAt.getTime()
    ) {
      Alert.alert("Invalid end date", "End date cannot be before start date.");
      return;
    }

    const goalPayload = buildGoalPayload(stakeCents);

    if (forGroup) {
      await createGroup.mutateAsync({
        name: groupName || title,
        description: groupDescription || undefined,
        goal: goalPayload,
      });
      router.dismissAll();
      router.replace("/(tabs)/goals");
      router.replace("/(tabs)/groups/create");
      router.dismissAll();
      return;
    }

    await createGoal.mutateAsync(goalPayload);
    router.dismissAll();
    router.replace("/(tabs)/goals");
  };

  return (
    <ScreenLayout fullscreen keyboardShouldPersistTaps="handled">
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
          textStyle={stake === 0 ? { color: danger } : undefined}
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
          minimumDate={startTime ?? undefined}
          placeholder="Optional"
          testID="end-time"
        />
      </FormGroup>

      <FormGroup title="Recurrence">
        <FormInputToggle
          label="Repeat weekly"
          value={isRecurring}
          onValueChange={(v: boolean) => {
            setIsRecurring(v);
            if (!v) {
              setEndAt(null);
              setRecMask(0);
            }
          }}
          testID="repeat-weekly"
        />
        {isRecurring && (
          <FormDateInput
            label="End date"
            date={endAt}
            onChange={(d: Date) =>
              onChangeEnd({ type: "set", nativeEvent: {} } as any, d)
            }
            minimumDate={startAt ?? undefined}
            placeholder="Optional"
            testID="end-date"
          />
        )}
        {isRecurring && (
          <FormWeekdaysInput
            label="Weekdays"
            mask={recMask}
            onChange={(next: number) => setRecMask(next)}
            testID="select-weekdays"
          />
        )}
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
        onPress={handleCreate}
        disabled={
          !title ||
          !startAt ||
          createGoal.isPending ||
          createGroup.isPending ||
          // Disable when invalid time window
          (startTime != null &&
            endTime != null &&
            startTime.getTime() > endTime.getTime()) ||
          // Disable when invalid end date for recurrence
          (isRecurring &&
            endAt != null &&
            startAt != null &&
            endAt.getTime() < startAt.getTime()) ||
          // Require duration when method is movement
          (method === "movement" &&
            !computeDurationMinutes(method, duration)) ||
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

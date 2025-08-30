import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import GoalNewScreen from "@/app/(tabs)/goals/create/new";

const mockDismissAll = jest.fn();
const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ dismissAll: mockDismissAll, replace: mockReplace }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  Stack: { Screen: () => null },
}));

const mockMutateGoal = jest.fn().mockResolvedValue({ id: "g1" });
const mockMutateGroup = jest.fn().mockResolvedValue({ id: "grp1" });

jest.mock("@/lib/hooks/useCreateGoal", () => ({
  useCreateGoal: () => ({
    mutateAsync: mockMutateGoal,
    isPending: false,
    error: null,
  }),
}));

jest.mock("@/lib/hooks/useCreateGroup", () => ({
  useCreateGroup: () => ({ mutateAsync: mockMutateGroup, isPending: false }),
}));

jest.mock("@/components/ui/form", () => ({
  FormGroup: ({ children }: any) => children,
  FormInput: ({ label, value, onChangeText, onChangeNumber }: any) => {
    const React = require("react");
    const { TextInput } = require("react-native");
    const handleChange = (text: string) => {
      if (onChangeText) onChangeText(text);
      if (onChangeNumber) {
        const num = text === "" ? null : Number(text);
        onChangeNumber(Number.isFinite(num as number) ? (num as number) : null);
      }
    };
    return React.createElement(TextInput, {
      accessibilityLabel: label,
      value,
      onChangeText: handleChange,
    });
  },
  FormDateInput: ({ label, date, onChange }: any) => (
    // @ts-ignore
    <mock-date accessibilityLabel={label} date={date} onChange={onChange} />
  ),
  FormTimeInput: ({ label, time, onChange }: any) => (
    // @ts-ignore
    <mock-time accessibilityLabel={label} time={time} onChange={onChange} />
  ),
  FormDurationInput: ({ label, duration, onChange }: any) => (
    // @ts-ignore
    <mock-duration
      accessibilityLabel={label}
      duration={duration}
      onChange={onChange}
    />
  ),
  FormSpacer: () => null,
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ title, onPress, disabled }: any) => {
    const React = require("react");
    const { Pressable, Text } = require("react-native");
    return React.createElement(
      Pressable,
      { accessibilityState: { disabled }, onPress },
      React.createElement(Text, null, title)
    );
  },
}));

describe("Goal new screen flows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates goal only and navigates to /(tabs)/goals", async () => {
    mockUseLocalSearchParams.mockReturnValue({});
    const user = userEvent.setup();
    render(<GoalNewScreen />);

    await user.type(screen.getByLabelText("Title"), "Morning Run");
    await user.type(screen.getByLabelText("Description"), "desc");
    await user.type(screen.getByLabelText("Stake (CHF)"), "1.23");

    await user.press(screen.getByText("Create Goal"));

    await waitFor(() => expect(mockMutateGoal).toHaveBeenCalled());
    expect(mockDismissAll).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/goals");
    expect(mockMutateGroup).not.toHaveBeenCalled();
  });

  it("creates group with embedded goal and navigates back to group create", async () => {
    mockUseLocalSearchParams.mockReturnValue({
      forGroup: "1",
      groupName: "New Group",
      groupDescription: "GD",
    });
    const user = userEvent.setup();
    render(<GoalNewScreen />);

    await user.type(screen.getByLabelText("Title"), "Goal T");
    await user.type(screen.getByLabelText("Stake (CHF)"), "1.00");

    await user.press(screen.getByText("Create Group"));

    await waitFor(() => expect(mockMutateGroup).toHaveBeenCalled());
    expect(mockDismissAll).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/goals");
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/groups/create");
  });
});

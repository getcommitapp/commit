import React from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import CustomGoalValidationScreen from "@/app/(tabs)/goals/create/custom";

const mockPush = jest.fn();
const mockUseLocalSearchParams = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  Stack: { Screen: () => null },
}));

// Avoid ScreenLayout internals (Platform.select, spacing) by mocking it to a passthrough View
jest.mock("@/components/layouts/ScreenLayout", () => ({
  ScreenLayout: ({ children }: any) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, null, children);
  },
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

jest.mock("@/components/ui/Card", () => ({
  Card: ({ left }: any) => (
    // @ts-ignore
    <mock-card hasLeft={!!left} />
  ),
}));

jest.mock("@/components/ui/CardList", () => ({
  CardList: ({ children }: any) => children,
}));

jest.mock("@/components/Themed", () => ({
  ThemedText: ({ children }: any) => children,
  textVariants: {},
  spacing: { xs: 0, lg: 0 },
  useThemeColor: () => "#ccc",
}));

describe("Custom goal forwarding", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ forGroup: "1", groupName: "G" });
  });

  it("forwards selected method and params to new goal screen", async () => {
    const user = userEvent.setup();
    render(<CustomGoalValidationScreen />);

    await user.press(screen.getByTestId("goal-option-photo"));

    const next = screen.getByText("Next");
    await user.press(next);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/(tabs)/goals/create/new",
      params: { forGroup: "1", groupName: "G", method: "photo" },
    });
  });
});

import React from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import CreateGroupScreen from "@/app/(tabs)/groups/create";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  Stack: { Screen: () => null },
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@/lib/hooks/useCreateGroup", () => ({
  useCreateGroup: () => ({ isPending: false, isError: false, error: null }),
}));

jest.mock("@/components/ui/form", () => ({
  FormGroup: ({ children }: any) => children,
  FormInput: ({ label, value, onChangeText }: any) => {
    const React = require("react");
    const { TextInput } = require("react-native");
    return React.createElement(TextInput, {
      accessibilityLabel: label,
      value,
      onChangeText,
    });
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

jest.mock("@/components/Themed", () => ({
  ThemedText: ({ children }: any) => children,
  spacing: { headerContentInset: 0, lg: 0 },
  textVariants: {},
}));

describe("Groups create navigation flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navigates to goals create with params on Next", async () => {
    const user = userEvent.setup();
    render(<CreateGroupScreen />);

    const nameInput = screen.getByLabelText("Name");
    const descInput = screen.getByLabelText("Description");

    await user.type(nameInput, "My Group");
    await user.type(descInput, "Cool desc");

    const next = screen.getByText("Next");
    await user.press(next);

    expect(mockPush).toHaveBeenCalledTimes(1);
    const pushed = mockPush.mock.calls[0][0];
    // Should include forGroup and provided fields
    expect(typeof pushed).toBe("string");
    const url = new URL(`https://example.com${pushed as string}`);
    expect(url.pathname).toBe("/(tabs)/goals/create");
    expect(url.searchParams.get("forGroup")).toBe("1");
    expect(url.searchParams.get("groupName")).toBe("My Group");
    expect(url.searchParams.get("groupDescription")).toBe("Cool desc");
  });
});

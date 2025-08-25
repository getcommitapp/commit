import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import { Platform } from "react-native";
import Signup from "@/app/signup";

import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: mockReplace }),
}));

// Mock Better Auth client sign-in
jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

describe("Signup flow", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    (AsyncStorage.getItem as jest.Mock).mockReset();
    const { authClient } = require("@/lib/auth-client");
    (authClient.signIn.social as jest.Mock).mockClear();
  });

  it("navigates to onboarding when not seen", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const user = userEvent.setup();
    const { unmount } = render(<Signup />);

    await user.press(screen.getByText("Sign in with Google"));

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/onboarding/1")
    );
    unmount();
  });

  it('navigates to /(tabs)/home when hasSeenOnboarding is "true"', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");
    const user = userEvent.setup();
    const { unmount } = render(<Signup />);

    await user.press(screen.getByText("Sign in with Google"));

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/home")
    );
    unmount();
  });

  it("renders Apple button only on iOS", async () => {
    const originalOS = Platform.OS as any;
    (Platform as any).OS = "android";
    const firstRender = render(<Signup />);
    expect(screen.queryByText("Sign in with Apple")).toBeNull();

    (Platform as any).OS = "ios";
    await firstRender.unmountAsync();
    const secondRender = render(<Signup />);
    expect(screen.getByText("Sign in with Apple")).toBeTruthy();

    (Platform as any).OS = originalOS;
    secondRender.unmount();
  });
});

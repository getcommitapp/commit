import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import { Platform } from "react-native";
import Signup from "@/app/signup";

jest.mock("@/lib/auth", () => ({
  signInWithGoogleOAuth: jest.fn(),
  signInWithApple: jest.fn(),
}));

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

// Mock Better Auth client session change
const listeners: Array<() => void> = [];
jest.mock("@/lib/auth-client", () => ({
  authClient: {
    onChange: (cb: () => void) => {
      listeners.push(cb);
      return { unsubscribe: () => {} } as any;
    },
    session: {
      get: jest.fn(),
    },
  },
}));

describe("Signup flow", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    (AsyncStorage.getItem as jest.Mock).mockReset();
  });

  it("navigates to onboarding when not seen", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const user = userEvent.setup();
    const { unmount } = render(<Signup />);

    await user.press(screen.getByText("Sign in with Google"));

    // Simulate Better Auth session becoming available
    const { authClient } = require("@/lib/auth-client");
    (authClient.session.get as jest.Mock).mockReturnValueOnce({ id: "s" });
    listeners.forEach((fn) => fn());

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

    const { authClient } = require("@/lib/auth-client");
    (authClient.session.get as jest.Mock).mockReturnValueOnce({ id: "s" });
    listeners.forEach((fn) => fn());

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/home")
    );
    unmount();
  });

  // The Better Auth client returns a simple unsubscribe; no need to assert
  // unsubscription behavior explicitly here.

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

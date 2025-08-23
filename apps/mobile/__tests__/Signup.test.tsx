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

// Mock supabase to control auth state changes in test
const mockOnAuthStateChange = jest.fn();
jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args),
    },
  },
}));

describe("Signup flow", () => {
  it("navigates to onboarding when not seen", async () => {
    let capturedHandler: (event: string, session: any) => void = () => {};
    mockOnAuthStateChange.mockImplementation((handler: any) => {
      capturedHandler = handler;
      return { data: { subscription: { unsubscribe: jest.fn() } } } as any;
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const user = userEvent.setup();
    const { unmount } = render(<Signup />);

    await user.press(screen.getByText("Sign in with Google"));

    // Simulate user becoming signed in, which should trigger navigate
    capturedHandler("SIGNED_IN", {} as any);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/onboarding/1")
    );
    unmount();
  });

  it('navigates to /(tabs)/home when hasSeenOnboarding is "true"', async () => {
    let capturedHandler: (event: string, session: any) => void = () => {};
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");
    mockOnAuthStateChange.mockImplementation((handler: any) => {
      capturedHandler = handler;
      return { data: { subscription: { unsubscribe: jest.fn() } } } as any;
    });

    const { unmount } = render(<Signup />);

    capturedHandler("SIGNED_IN", {} as any);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/home")
    );
    unmount();
  });

  it("unsubscribes auth listener on unmount", async () => {
    const unsubscribe = jest.fn();
    mockOnAuthStateChange.mockImplementation((_handler: any) => {
      return { data: { subscription: { unsubscribe } } } as any;
    });
    const { unmount } = render(<Signup />);
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
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

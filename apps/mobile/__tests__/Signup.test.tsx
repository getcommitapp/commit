import React from "react";
import renderer, { act } from "react-test-renderer";
import { Alert, Platform } from "react-native";
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
    let root: renderer.ReactTestRenderer;
    let capturedHandler: (event: string, session: any) => void = () => {};
    mockOnAuthStateChange.mockImplementation((handler: any) => {
      capturedHandler = handler;
      return { data: { subscription: { unsubscribe: jest.fn() } } } as any;
    });
    await act(async () => {
      root = renderer.create(<Signup />);
    });

    const pressables = root!.root.findAll((n) => n.props?.onPress);
    await act(async () => {
      pressables[0].props.onPress();
    });

    // Simulate user becoming signed in, which should trigger navigate
    await act(async () => {
      capturedHandler("SIGNED_IN", {} as any);
    });

    expect(mockReplace).toHaveBeenCalledWith("/onboarding/1");
  });

  it('navigates to /(tabs)/home when hasSeenOnboarding is "true"', async () => {
    let root: renderer.ReactTestRenderer;
    let capturedHandler: (event: string, session: any) => void = () => {};
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");
    mockOnAuthStateChange.mockImplementation((handler: any) => {
      capturedHandler = handler;
      return { data: { subscription: { unsubscribe: jest.fn() } } } as any;
    });
    await act(async () => {
      root = renderer.create(<Signup />);
    });

    await act(async () => {
      capturedHandler("SIGNED_IN", {} as any);
    });

    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/home");
  });

  it("unsubscribes auth listener on unmount", async () => {
    let root: renderer.ReactTestRenderer;
    const unsubscribe = jest.fn();
    mockOnAuthStateChange.mockImplementation((_handler: any) => {
      return { data: { subscription: { unsubscribe } } } as any;
    });
    await act(async () => {
      root = renderer.create(<Signup />);
    });
    await act(async () => {
      root.unmount();
    });
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("renders Apple button only on iOS", async () => {
    const originalOS = Platform.OS as any;
    (Platform as any).OS = "android";
    let androidTree!: renderer.ReactTestRenderer;
    await act(async () => {
      androidTree = renderer.create(<Signup />);
    });
    const findLabel = (r: renderer.ReactTestRenderer) =>
      r.root.findAll(
        (n) =>
          typeof n.props?.children === "string" &&
          n.props.children === "Sign in with Apple"
      );
    expect(findLabel(androidTree).length).toBe(0);

    (Platform as any).OS = "ios";
    let iosTree!: renderer.ReactTestRenderer;
    await act(async () => {
      iosTree = renderer.create(<Signup />);
    });
    expect(findLabel(iosTree).length).toBeGreaterThan(0);

    (Platform as any).OS = originalOS;
  });
});

import React from "react";
import renderer, { act } from "react-test-renderer";
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
  it("sets hasSeenOnboarding and navigates to /(tabs) on continue", async () => {
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

    // Simulate user becoming signed in, which should trigger navigateToApp
    await act(async () => {
      capturedHandler("SIGNED_IN", {} as any);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "hasSeenOnboarding",
      "true"
    );
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
  });
});

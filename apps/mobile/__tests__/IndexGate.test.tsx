import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IndexGate from "@/app/index";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("../config", () => ({
  config: { devResetOnboardingOnReload: false },
}));

jest.mock("expo-router", () => ({
  Redirect: (props: any) => null,
}));

// Use waitFor to await async state updates instead of manual flushing

describe("IndexGate onboarding redirect", () => {
  it("redirects to /signup when hasSeenOnboarding is null", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    render(<IndexGate />);
    await waitFor(() => {
      const redirect = screen.UNSAFE_getByType(Redirect as any);
      expect(redirect.props.href).toBe("/signup");
    });
  });

  it('redirects to /signup when hasSeenOnboarding is "false"', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("false");

    render(<IndexGate />);
    await waitFor(() => {
      const redirect = screen.UNSAFE_getByType(Redirect as any);
      expect(redirect.props.href).toBe("/signup");
    });
  });

  it('redirects to /(tabs)/home when hasSeenOnboarding is "true"', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");

    render(<IndexGate />);
    await waitFor(() => {
      const redirect = screen.UNSAFE_getByType(Redirect as any);
      expect(redirect.props.href).toBe("/(tabs)/home");
    });
  });
});

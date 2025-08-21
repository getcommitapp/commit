import React from "react";
import renderer, { act } from "react-test-renderer";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IndexGate from "@/app/index";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("../config", () => ({
  config: { resetOnboardingOnReload: false },
}));

jest.mock("expo-router", () => ({
  Redirect: (props: any) => null,
}));

const flush = () => new Promise((resolve) => setImmediate(resolve));

describe("IndexGate onboarding redirect", () => {
  it("redirects to /signup when hasSeenOnboarding is null", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    let root: renderer.ReactTestRenderer;
    await act(async () => {
      root = renderer.create(<IndexGate />);
      await flush();
    });

    const redirect = root!.root.findByType(Redirect);
    expect(redirect.props.href).toBe("/signup");
  });

  it('redirects to /signup when hasSeenOnboarding is "false"', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("false");

    let root: renderer.ReactTestRenderer;
    await act(async () => {
      root = renderer.create(<IndexGate />);
      await flush();
    });

    const redirect = root!.root.findByType(Redirect);
    expect(redirect.props.href).toBe("/signup");
  });

  it('redirects to /(tabs) when hasSeenOnboarding is "true"', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");

    let root: renderer.ReactTestRenderer;
    await act(async () => {
      root = renderer.create(<IndexGate />);
      await flush();
    });

    const redirect = root!.root.findByType(Redirect);
    expect(redirect.props.href).toBe("/(tabs)");
  });
});

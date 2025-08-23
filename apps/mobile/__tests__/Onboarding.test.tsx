import React from "react";
import renderer, { act } from "react-test-renderer";

import Step1 from "@/app/onboarding/1";
import Step2 from "@/app/onboarding/2";
import Step3 from "@/app/onboarding/3";
import Step4 from "@/app/onboarding/4";

import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  Stack: { Screen: () => null },
}));

describe("Onboarding flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Step 1 navigates to /onboarding/2 on Next", async () => {
    let root: renderer.ReactTestRenderer;
    await act(async () => {
      root = renderer.create(<Step1 />);
    });

    const nextButton = root!.root.findAll(
      (n) => typeof n.props?.title === "string" && n.props.title === "Next"
    );
    expect(nextButton.length).toBeGreaterThan(0);

    await act(async () => {
      nextButton[0].props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith("/onboarding/2");
  });

  it("Step 2 navigates to /onboarding/3 on Next", async () => {
    let root: renderer.ReactTestRenderer;
    await act(async () => {
      root = renderer.create(<Step2 />);
    });

    const nextButton = root!.root.findAll(
      (n) => typeof n.props?.title === "string" && n.props.title === "Next"
    );
    expect(nextButton.length).toBeGreaterThan(0);

    await act(async () => {
      nextButton[0].props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith("/onboarding/3");
  });

  it("Step 3 navigates to /onboarding/4 on Next", async () => {
    let root: renderer.ReactTestRenderer;
    await act(async () => {
      root = renderer.create(<Step3 />);
    });

    const nextButton = root!.root.findAll(
      (n) => typeof n.props?.title === "string" && n.props.title === "Next"
    );
    expect(nextButton.length).toBeGreaterThan(0);

    await act(async () => {
      nextButton[0].props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith("/onboarding/4");
  });

  it("Step 4 stores flag and redirects to /(tabs)/home on Get started", async () => {
    let root: renderer.ReactTestRenderer;
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

    await act(async () => {
      root = renderer.create(<Step4 />);
    });

    const getStartedButton = root!.root.findAll(
      (n) =>
        typeof n.props?.title === "string" && n.props.title === "Get started"
    );
    expect(getStartedButton.length).toBeGreaterThan(0);

    await act(async () => {
      getStartedButton[0].props.onPress();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "hasSeenOnboarding",
      "true"
    );
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/home");
  });
});

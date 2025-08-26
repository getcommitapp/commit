import React from "react";
import { render, screen, userEvent } from "@testing-library/react-native";

import Step1 from "@/app/onboarding/1";
import Step2 from "@/app/onboarding/2";
import Step3 from "@/app/onboarding/3";
import Step4 from "@/app/onboarding/4";

import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const user = userEvent.setup();
    render(<Step1 />);

    const nextButton = screen.getByText("Next");
    await user.press(nextButton);

    expect(mockPush).toHaveBeenCalledWith("/onboarding/2");
  });

  it("Step 2 navigates to /onboarding/3 on Next", async () => {
    const user = userEvent.setup();
    render(<Step2 />);

    await user.press(screen.getByText("Next"));

    expect(mockPush).toHaveBeenCalledWith("/onboarding/3");
  });

  it("Step 3 navigates to /onboarding/4 on Next", async () => {
    const user = userEvent.setup();
    render(<Step3 />);

    await user.press(screen.getByText("Next"));

    expect(mockPush).toHaveBeenCalledWith("/onboarding/4");
  });

  it("Step 4 stores flag and redirects to /(tabs)/home on Get started", async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<Step4 />);

    await user.press(screen.getByText("Get started"));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "hasSeenOnboarding",
      "true"
    );
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/home");
  });
});

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

describe("Signup flow", () => {
  it("sets hasSeenOnboarding and navigates to /(tabs) on continue", async () => {
    let root: renderer.ReactTestRenderer;
    await act(async () => {
      root = renderer.create(<Signup />);
    });

    const pressables = root!.root.findAll((n) => n.props?.onPress);
    await act(async () => {
      pressables[0].props.onPress();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "hasSeenOnboarding",
      "true"
    );
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
  });
});

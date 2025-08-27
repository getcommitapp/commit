import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootLayout from "@/app/_layout";

// Config used in layout
jest.mock("@/config", () => ({
  config: { devResetOnboardingOnReload: false, devDefaultPage: undefined },
}));

// Colors, theme, and color scheme used in layout
jest.mock("@/constants/Colors", () => ({
  __esModule: true,
  default: {
    light: {
      background: "#fff",
      card: "#fff",
      border: "#eee",
      text: "#000",
      primary: "#000",
    },
    dark: {
      background: "#000",
      card: "#000",
      border: "#111",
      text: "#fff",
      primary: "#fff",
    },
  },
}));
jest.mock("@/components/Themed", () => ({
  ThemedView: ({ children }: any) => children,
}));
jest.mock("@/components/useColorScheme", () => ({
  useColorScheme: () => "light",
}));
// Safe area context is globally mocked in jest.setup.ts

// React Navigation is globally mocked in jest.setup.ts

// Reanimated is globally mocked in jest.setup.ts

// Router: mock Stack to expose initialRouteName via a testID node
jest.mock("expo-router", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const Stack: any = ({ initialRouteName, children }: any) =>
    React.createElement(Text, { testID: "initialRoute" }, initialRouteName);
  Stack.Screen = () => null;
  return {
    __esModule: true,
    useRouter: () => ({ replace: jest.fn() }),
    ErrorBoundary: ({ children }: any) => children,
    Stack,
  };
});

describe("RootLayout onboarding initial route", () => {
  it("uses 'signup' when hasSeenOnboarding is null", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    render(<RootLayout />);
    await waitFor(() => {
      expect(screen.getByTestId("initialRoute").props.children).toBe("signup");
    });
  });

  it("uses 'signup' when hasSeenOnboarding is 'false'", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("false");

    render(<RootLayout />);
    await waitFor(() => {
      expect(screen.getByTestId("initialRoute").props.children).toBe("signup");
    });
  });

  it("uses '(tabs)' when hasSeenOnboarding is 'true'", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");

    render(<RootLayout />);
    await waitFor(() => {
      expect(screen.getByTestId("initialRoute").props.children).toBe("(tabs)");
    });
  });
});

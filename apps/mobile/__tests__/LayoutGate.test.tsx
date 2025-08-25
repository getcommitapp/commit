import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootLayout from "@/app/_layout";

// AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Config used in layout
jest.mock("@/config", () => ({
  config: { devResetOnboardingOnReload: false, devDefaultPage: undefined },
}));

// Colors and themed components used in layout
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
  View: ({ children }: any) => children,
}));
jest.mock("@/components/useColorScheme", () => ({
  useColorScheme: () => "light",
}));

// Expo modules used in layout
jest.mock("expo-font", () => ({
  useFonts: () => [true, undefined],
}));
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: jest.fn(),
}));
jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

// React Navigation (ESM) - provide minimal mocks to avoid ESM parsing in Jest
jest.mock("@react-navigation/native", () => ({
  DarkTheme: { colors: {} },
  DefaultTheme: { colors: {} },
  ThemeProvider: ({ children }: any) => children,
}));

// Reanimated side-effect import
jest.mock("react-native-reanimated", () => ({}));

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

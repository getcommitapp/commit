import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);
// Mock bottom sheet to avoid loading native modules in Jest
jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  BottomSheetModalProvider: ({ children }: any) => children,
}));
// Minimal mock for gesture handler root view
jest.mock("react-native-gesture-handler", () => ({
  __esModule: true,
  GestureHandlerRootView: ({ children }: any) => children,
}));
// Expo + RN ecosystem common mocks
jest.mock("expo-font", () => ({
  __esModule: true,
  // Hook
  useFonts: () => [true, undefined],
  // Namespace import usage in @expo/vector-icons
  isLoaded: () => true,
  loadAsync: jest.fn().mockResolvedValue(undefined),
  // also provide a nested Font object for consumers using `Font.isLoaded`
  Font: {
    isLoaded: () => true,
    loadAsync: jest.fn().mockResolvedValue(undefined),
  },
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
jest.mock("@react-navigation/native", () => ({
  __esModule: true,
  DarkTheme: { colors: {} },
  DefaultTheme: { colors: {} },
  ThemeProvider: ({ children }: any) => children,
}));
jest.mock("react-native-reanimated", () => ({}));

// AsyncStorage global mock
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

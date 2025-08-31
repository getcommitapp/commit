import React from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import GoalCreateChoiceScreen from "@/app/(tabs)/goals/create";

const mockPush = jest.fn();
const mockUseLocalSearchParams = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  Stack: { Screen: () => null },
}));

jest.mock("@/components/ui/Card", () => ({
  Card: ({ left, right }: any) => (
    // @ts-ignore
    <mock-card left={!!left} right={!!right} />
  ),
}));

jest.mock("@/components/ui/CardList", () => ({
  CardList: ({ children }: any) => children,
}));

jest.mock("@/components/ui/SmallText", () => ({
  SmallText: ({ children }: any) => children,
}));

jest.mock("@/components/Themed", () => ({
  ThemedText: ({ children }: any) => children,
  textVariants: {},
  spacing: { lg: 0 },
  useThemeColor: () => "#ccc",
}));

describe("Goals create choice routing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ forGroup: "1", groupName: "X" });
  });

  it("pressing custom forwards params", async () => {
    const user = userEvent.setup();
    render(<GoalCreateChoiceScreen />);

    await user.press(screen.getByTestId("choose-custom-goal"));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/(tabs)/goals/create/custom",
      params: { forGroup: "1", groupName: "X" },
    });
  });

  it("pressing wake-up template forwards method=checkin", async () => {
    const user = userEvent.setup();
    render(<GoalCreateChoiceScreen />);

    await user.press(screen.getByTestId("choose-wake-up-goal"));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/(tabs)/goals/create/new",
      params: { forGroup: "1", groupName: "X", method: "checkin" },
    });
  });

  it("pressing no-phone template forwards method=movement", async () => {
    const user = userEvent.setup();
    render(<GoalCreateChoiceScreen />);

    await user.press(screen.getByTestId("choose-no-phone-goal"));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/(tabs)/goals/create/new",
      params: { forGroup: "1", groupName: "X", method: "movement" },
    });
  });
});

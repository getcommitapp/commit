import React from "react";
import { render, screen } from "@testing-library/react-native";

import TabLayout from "@/app/(tabs)/_layout";

// Mock expo-router Tabs to make props introspectable in tests
jest.mock("expo-router", () => {
  function Tabs(props: any) {
    const { children, ...rest } = props;
    // @ts-ignore - Property 'mock-tabs' does not exist on type 'JSX.IntrinsicElements'.
    return <mock-tabs {...rest}>{children}</mock-tabs>;
  }
  // attach Screen as a static property
  (Tabs as any).Screen = (screenProps: any) => (
    // @ts-ignore - Property 'mock-tab-screen' does not exist on type 'JSX.IntrinsicElements'.
    <mock-tab-screen {...screenProps} />
  );

  return {
    Tabs,
  };
});

describe("Tabs layout", () => {
  it("defines 4 tabs with correct names and titles and sets initial route", () => {
    render(<TabLayout />);

    const tabs = screen.UNSAFE_getByType("mock-tabs" as any);
    expect(tabs.props.initialRouteName).toBe("home");
    expect(tabs.props.screenOptions.headerShown).toBe(false);

    const screens = screen.UNSAFE_getAllByType("mock-tab-screen" as any);
    const byName: Record<string, any> = Object.fromEntries(
      screens.map((s: any) => [s.props.name, s])
    );

    expect(Object.keys(byName)).toEqual([
      "home",
      "goals",
      "groups",
      "reviews",
      "profile",
    ]);
    expect(byName.home.props.options.title).toBe("Home");
    expect(byName.goals.props.options.title).toBe("Goals");
    expect(byName.groups.props.options.title).toBe("Groups");
    expect(byName.reviews.props.options.title).toBe("Reviews");
    expect(byName.profile.props.options.title).toBe("Profile");

    Object.values(byName).forEach((screenItem: any) => {
      expect(typeof screenItem.props.options.tabBarIcon).toBe("function");
    });
  });
});

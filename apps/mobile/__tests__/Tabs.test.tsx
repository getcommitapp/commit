import React from "react";
import renderer, { act } from "react-test-renderer";

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
  it("defines 4 tabs with correct names and titles and sets initial route", async () => {
    let root: renderer.ReactTestRenderer;
    await act(async () => {
      root = renderer.create(<TabLayout />);
    });

    const tabs = root!.root.findByType("mock-tabs" as any);
    expect(tabs.props.initialRouteName).toBe("home");
    // Header should be hidden on all screens via screenOptions
    expect(tabs.props.screenOptions.headerShown).toBe(false);

    const screens = root!.root.findAllByType("mock-tab-screen" as any);
    const byName: Record<string, any> = Object.fromEntries(
      screens.map((s) => [s.props.name, s])
    );

    expect(Object.keys(byName)).toEqual(["home", "goals", "groups", "profile"]);

    expect(byName.home.props.options.title).toBe("Home");
    expect(byName.goals.props.options.title).toBe("Goals");
    expect(byName.groups.props.options.title).toBe("Groups");
    expect(byName.profile.props.options.title).toBe("Profile");

    // Ensure each tab defines a tabBarIcon function
    Object.values(byName).forEach((screen: any) => {
      expect(typeof screen.props.options.tabBarIcon).toBe("function");
    });
  });
});

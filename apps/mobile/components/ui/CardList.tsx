import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColor, radii } from "@/components/Themed";

type CardListProps = {
  children: React.ReactNode;
  style?: any;
};

export default function CardList({ children, style }: CardListProps) {
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  const childArray = React.Children.toArray(children).filter(Boolean);

  return (
    <View
      style={[
        {
          backgroundColor: card,
          borderRadius: radii.md,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {childArray.map((child, index) => (
        <View
          key={index}
          style={
            index > 0
              ? {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: border,
                }
              : undefined
          }
        >
          {child}
        </View>
      ))}
    </View>
  );
}

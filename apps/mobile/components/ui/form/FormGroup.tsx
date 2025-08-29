import React from "react";
import { View } from "react-native";
import { ThemedText, spacing, radii, useThemeColor } from "@/components/Themed";
import { SmallText } from "../SmallText";
import { FormSpacer } from "./FormSpacer";

interface FormGroupProps {
  title?: string;
  children: React.ReactNode;
  footer?: string;
  style?: any;
  backgroundStyle?: any;
}

export function FormGroup({
  title,
  children,
  footer,
  style,
  backgroundStyle,
}: FormGroupProps) {
  const card = useThemeColor({}, "card");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const border = useThemeColor({}, "border");

  return (
    <View style={{ marginBottom: spacing.xl, ...style }}>
      {title ? <SmallText>{title}</SmallText> : null}
      <View
        style={{
          backgroundColor: card,
          borderRadius: radii.md,
          overflow: "hidden",
          ...backgroundStyle,
        }}
      >
        {(() => {
          const childArray = React.Children.toArray(children).filter(Boolean);
          return childArray.map((child, index) => {
            const currentIsSpacer =
              React.isValidElement(child) && child.type === FormSpacer;
            const next = childArray[index + 1];
            const nextIsSpacer =
              React.isValidElement(next) &&
              next &&
              (next as any).type === FormSpacer;

            return (
              <React.Fragment key={(child as any)?.key ?? `row-${index}`}>
                {child}
                {index < childArray.length - 1 &&
                !currentIsSpacer &&
                !nextIsSpacer ? (
                  <View
                    style={{
                      height: 0.5,
                      marginTop: 0.5,
                      backgroundColor: border,
                      marginLeft: spacing.xl,
                    }}
                  />
                ) : null}
              </React.Fragment>
            );
          });
        })()}
      </View>
      {footer ? (
        <ThemedText
          style={{
            color: mutedForeground,
            marginTop: spacing.xs,
            marginLeft: spacing.xs,
          }}
        >
          {footer}
        </ThemedText>
      ) : null}
    </View>
  );
}

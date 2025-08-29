import { Text, TextStyle } from "react-native";
import { spacing, textVariants, useThemeColor } from "@/components/Themed";

interface SmallTextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function SmallText({ children, style }: SmallTextProps) {
  const mutedForeground = useThemeColor({}, "mutedForeground");
  return (
    <Text
      style={{
        ...textVariants.footnote,
        textTransform: "uppercase",
        color: mutedForeground,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
        ...style,
      }}
    >
      {children}
    </Text>
  );
}

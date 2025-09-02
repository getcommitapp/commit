import { Pressable, ViewStyle } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import { radii, ThemedText, useThemeColor } from "@/components/Themed";

interface HeaderButtonProps {
  icon: keyof typeof IonIcons.glyphMap;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function HeaderButton({
  icon,
  label,
  onPress,
  style,
}: HeaderButtonProps) {
  const color = useThemeColor({}, "primary");
  const accent = useThemeColor({}, "accent");

  return (
    <Pressable
      accessibilityRole="button"
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: radii.lg,
          backgroundColor: accent,
        },
        style,
      ]}
      onPress={onPress}
      accessibilityLabel={label}
      testID={label}
      hitSlop={10}
    >
      <IonIcons name={icon} size={18} color={color} />
      <ThemedText style={{ fontSize: 14, color }}>{label}</ThemedText>
    </Pressable>
  );
}

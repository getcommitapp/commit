import { Pressable, ViewStyle } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import { ThemedText, useThemeColor } from "@/components/Themed";

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
  const backgroundColor = useThemeColor({}, "colorfulBackground");

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
          borderRadius: 20,
          backgroundColor,
        },
        style,
      ]}
      onPress={onPress}
    >
      <IonIcons name={icon} size={18} color={color} />
      <ThemedText style={{ fontSize: 14, color }}>{label}</ThemedText>
    </Pressable>
  );
}

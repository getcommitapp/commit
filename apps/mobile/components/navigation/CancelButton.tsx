import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useThemeColor, textVariants } from "@/components/Themed";
//import IonIcons from "@expo/vector-icons/Ionicons";

interface CancelButtonProps {
  onPress?: () => void;
  text?: string;
}

export function CancelButton({ onPress, text = "Cancel" }: CancelButtonProps) {
  const primaryColor = useThemeColor({}, "primary");
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable hitSlop={10} onPress={handlePress}>
      <Text style={[textVariants.body, { color: primaryColor }]}>{text}</Text>
    </Pressable>
  );
}

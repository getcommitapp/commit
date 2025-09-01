import { ActivityIndicator, View, ViewStyle, Text } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import {
  textVariants,
  ThemedText,
  useThemeColor,
  spacing,
} from "@/components/Themed";

type StatusType = "loading" | "error" | "empty";

interface StatusLayoutProps {
  status: StatusType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  largeTitle?: boolean;
  scrollable?: boolean;
  onRefresh?: (() => void) | (() => Promise<void>);
  style?: ViewStyle;
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
}

export const StatusLayout = ({
  status,
  title,
  message,
  largeTitle = false,
  scrollable = true,
  onRefresh,
  style,
  preContent,
  postContent,
}: StatusLayoutProps) => {
  const danger = useThemeColor({}, "danger");
  const mutedForeground = useThemeColor({}, "mutedForeground");

  return (
    <ScreenLayout
      largeTitle={largeTitle}
      scrollable={scrollable}
      onRefresh={onRefresh}
      style={{
        flex: 1,
        ...style,
      }}
    >
      {preContent}
      <View style={{ flex: 1, justifyContent: "center", gap: spacing.xxl }}>
        <View style={{ alignItems: "center" }}>
          {status === "loading" && (
            <>
              <ActivityIndicator />
              <ThemedText style={{ marginTop: spacing.sm }}>{title}</ThemedText>
            </>
          )}

          {status === "error" && (
            <>
              <ThemedText style={textVariants.bodyEmphasized}>
                {title}
              </ThemedText>
              {message && (
                <Text
                  style={{
                    marginTop: spacing.sm,
                    textDecorationLine: "underline",
                    color: danger,
                  }}
                >
                  {message}
                </Text>
              )}
            </>
          )}

          {status === "empty" && (
            <>
              <ThemedText style={textVariants.bodyEmphasized}>
                {title}
              </ThemedText>
              {message && (
                <Text
                  style={{
                    textAlign: "center",
                    color: mutedForeground,
                    marginTop: spacing.sm,
                  }}
                >
                  {message}
                </Text>
              )}
            </>
          )}
        </View>
        {postContent}
      </View>
    </ScreenLayout>
  );
};

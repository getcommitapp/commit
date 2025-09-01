import { ActivityIndicator } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { textVariants, ThemedText } from "@/components/Themed";

type StatusType = "loading" | "error" | "empty";

interface StatusLayoutProps {
  status: StatusType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  largeTitle?: boolean;
  scrollable?: boolean;
  onRefresh?: () => void;
}

export const StatusLayout = ({
  status,
  title,
  message,
  largeTitle = true,
  scrollable = false,
  onRefresh,
}: StatusLayoutProps) => {
  return (
    <ScreenLayout
      largeTitle={largeTitle}
      scrollable={scrollable}
      onRefresh={onRefresh}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {status === "loading" && (
        <>
          <ActivityIndicator />
          <ThemedText style={{ marginTop: 12 }}>{title}</ThemedText>
        </>
      )}

      {status === "error" && (
        <>
          <ThemedText style={textVariants.bodyEmphasized}>{title}</ThemedText>
          {message && (
            <ThemedText
              style={{
                marginTop: 12,
                textDecorationLine: "underline",
              }}
            ></ThemedText>
          )}
        </>
      )}

      {status === "empty" && (
        <>
          <ThemedText style={textVariants.bodyEmphasized}>{title}</ThemedText>
          {message && (
            <ThemedText style={{ textAlign: "center" }}>{message}</ThemedText>
          )}
        </>
      )}
    </ScreenLayout>
  );
};

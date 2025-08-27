import { ThemedText, ThemedTextProps } from "./Themed";

export function MonoText(props: ThemedTextProps) {
  return (
    <ThemedText {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />
  );
}

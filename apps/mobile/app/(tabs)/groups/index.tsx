import CardList from "@/components/ui/CardList";
import { GroupCard } from "@/components/groups/GroupCard";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useGroups } from "@/lib/hooks/useGroups";
import { ThemedText, textVariants } from "@/components/Themed";
import { ActivityIndicator, View } from "react-native";

export default function GroupsScreen() {
  const { data: groups, isLoading, isError, refetch } = useGroups();

  return (
    <ScreenLayout largeTitle>
      {isLoading ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <ActivityIndicator />
          <ThemedText style={{ marginTop: 12 }}>
            Loading your groups...
          </ThemedText>
        </View>
      ) : isError ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <ThemedText style={textVariants.bodyEmphasized}>
            Couldn&apos;t load groups
          </ThemedText>
          <ThemedText
            onPress={() => refetch()}
            style={{ marginTop: 12, textDecorationLine: "underline" }}
          >
            Tap to retry
          </ThemedText>
        </View>
      ) : groups && groups.length === 0 ? (
        <View style={{ padding: 24, gap: 8 }}>
          <ThemedText style={textVariants.bodyEmphasized}>
            No groups yet
          </ThemedText>
          <ThemedText>Join or create a group to get started.</ThemedText>
        </View>
      ) : (
        <CardList>
          {groups?.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </CardList>
      )}
    </ScreenLayout>
  );
}

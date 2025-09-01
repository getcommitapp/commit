import { CardList } from "@/components/ui/CardList";
import { GroupCard } from "@/components/groups/GroupCard";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useGroups } from "@/lib/hooks/useGroups";
import { StatusLayout } from "@/components/layouts/StatusLayout";

export default function GroupsScreen() {
  const { data: groups, isLoading, isError, refetch } = useGroups();

  if (isLoading) {
    return (
      <StatusLayout
        largeTitle
        status="loading"
        title="Loading your groups..."
      />
    );
  }

  if (isError) {
    return (
      <StatusLayout
        largeTitle
        status="error"
        title="Couldn't load groups"
        onRefresh={refetch}
      />
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <StatusLayout
        largeTitle
        status="empty"
        title="No groups yet"
        message="Join or create a group to get started."
        onRefresh={refetch}
      />
    );
  }

  return (
    <ScreenLayout largeTitle onRefresh={refetch}>
      <CardList>
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </CardList>
    </ScreenLayout>
  );
}

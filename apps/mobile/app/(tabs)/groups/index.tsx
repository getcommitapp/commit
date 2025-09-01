import { CardList } from "@/components/ui/CardList";
import { GroupCard } from "@/components/groups/GroupCard";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useGroups } from "@/lib/hooks/useGroups";
import { StatusLayout } from "@/components/layouts/StatusLayout";

export default function GroupsScreen() {
  const { data: groups, isLoading, isError, refetch } = useGroups();

  if (isLoading) {
    return <StatusLayout status="loading" title="Loading your groups..." />;
  }

  if (isError) {
    return (
      <StatusLayout
        status="error"
        title="Couldn't load groups"
        onRefresh={refetch}
      />
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <StatusLayout
        status="empty"
        title="No groups yet"
        message="Join or create a group to get started."
        onRefresh={refetch}
      />
    );
  }

  return (
    <ScreenLayout
      largeTitle
      onRefresh={async () => {
        await refetch();
      }}
    >
      <CardList>
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </CardList>
    </ScreenLayout>
  );
}

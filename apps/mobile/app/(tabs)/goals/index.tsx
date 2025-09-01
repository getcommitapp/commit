import { CardList } from "@/components/ui/CardList";
import { GoalCard } from "@/components/goals/GoalCard";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useGoals } from "@/lib/hooks/useGoals";
import { StatusLayout } from "@/components/layouts/StatusLayout";

export default function GoalsScreen() {
  const { data: goals, isLoading, isError, refetch } = useGoals();

  if (isLoading) {
    return <StatusLayout status="loading" title="Loading goals..." />;
  }

  if (isError) {
    return (
      <StatusLayout
        status="error"
        title="Failed to load goals."
        onRefresh={refetch}
      />
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <StatusLayout
        status="empty"
        title="No goals yet"
        message="Create your first goal to get started!"
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
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </CardList>
    </ScreenLayout>
  );
}

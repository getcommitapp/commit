import CardList from "@/components/ui/CardList";
import GoalCard, { Goal } from "@/components/goals/GoalCard";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Morning Workout",
    description: "Complete a 30-minute morning workout routine.",
    stake: "CHF 50",
    timeLeft: "2h left",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    streak: 2,
  },
  {
    id: "2",
    title: "Run 2 km",
    description: "Run at least 2 kilometers without stopping.",
    stake: "CHF 20",
    timeLeft: "6h left",
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    streak: 10,
  },
  {
    id: "3",
    title: "Study 3 hours",
    description: "Focus study session without distractions.",
    stake: "CHF 30",
    timeLeft: "1d left",
    startDate: "2025-03-10",
    endDate: "2025-04-10",
  },
  {
    id: "4",
    title: "No Sugar Day",
    description: "Avoid sugary snacks and drinks for a day.",
    stake: "CHF 15",
    timeLeft: "8h left",
    startDate: "2025-03-15",
    endDate: "2025-03-16",
    streak: 4,
  },
  {
    id: "5",
    title: "Read 20 pages",
    description: "Read at least 20 pages of a book.",
    stake: "CHF 10",
    timeLeft: "5h left",
    startDate: "2025-03-12",
    endDate: "2025-03-12",
  },
  {
    id: "6",
    title: "Meditate 15 min",
    description: "Mindfulness meditation session.",
    stake: "CHF 5",
    timeLeft: "3h left",
    startDate: "2025-03-11",
    endDate: "2025-03-11",
    streak: 7,
  },
  {
    id: "7",
    title: "Drink 2L water",
    description: "Hydration goal for the day.",
    stake: "CHF 5",
    timeLeft: "Today",
    startDate: "2025-03-11",
    endDate: "2025-03-11",
  },
  {
    id: "8",
    title: "Practice guitar",
    description: "30 minutes of scales and a new song.",
    stake: "CHF 25",
    timeLeft: "9h left",
    startDate: "2025-03-10",
    endDate: "2025-04-10",
  },
  {
    id: "9",
    title: "Write journal",
    description: "Reflect and write for 10 minutes.",
    stake: "CHF 5",
    timeLeft: "Tonight",
    startDate: "2025-03-11",
    endDate: "2025-03-11",
    streak: 12,
  },
  {
    id: "10",
    title: "Pushups x50",
    description: "Complete 50 pushups throughout the day.",
    stake: "CHF 15",
    timeLeft: "4h left",
    startDate: "2025-03-11",
    endDate: "2025-03-11",
  },
  {
    id: "11",
    title: "Inbox Zero",
    description: "Clear all emails and tasks.",
    stake: "CHF 20",
    timeLeft: "Today",
    startDate: "2025-03-11",
    endDate: "2025-03-11",
  },
  {
    id: "12",
    title: "Walk 10k steps",
    description: "Daily steps target.",
    stake: "CHF 10",
    timeLeft: "11h left",
    startDate: "2025-03-11",
    endDate: "2025-03-11",
    streak: 3,
  },
];

export default function GoalsScreen() {
  return (
    <ScreenLayout largeTitle>
      <CardList>
        {mockGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </CardList>
    </ScreenLayout>
  );
}

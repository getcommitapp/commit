import CardList from "@/components/ui/CardList";
import { GroupCard, Group } from "@/components/groups/GroupCard";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

const mockGroups: Group[] = [
  {
    id: "1",
    title: "Morning Workout Squad",
    description:
      "Join our daily morning workout challenge. Everyone commits to 30 minutes of exercise before 8 AM.",
    totalStake: "CHF 500",
    memberCount: 8,
    timeLeft: "2h left",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
  },
  {
    id: "2",
    title: "Study Marathon",
    description:
      "Intensive study session for the upcoming exams. 4 hours of focused study time.",
    totalStake: "CHF 300",
    memberCount: 5,
    timeLeft: "6h left",
    startDate: "2025-02-01",
    endDate: "2025-02-28",
  },
  {
    id: "3",
    title: "No Sugar Challenge",
    description:
      "Avoid all sugary foods and drinks for a week. Support each other through cravings.",
    totalStake: "CHF 200",
    memberCount: 12,
    timeLeft: "1d left",
    startDate: "2025-03-10",
    endDate: "2025-03-17",
  },
  {
    id: "4",
    title: "Reading Club",
    description:
      "Read 50 pages per day and discuss the book together. Great for building reading habits.",
    totalStake: "CHF 150",
    memberCount: 6,
    timeLeft: "8h left",
    startDate: "2025-03-15",
    endDate: "2025-04-15",
  },
  {
    id: "5",
    title: "Meditation Masters",
    description:
      "Daily 15-minute meditation sessions. Track your mindfulness journey together.",
    totalStake: "CHF 100",
    memberCount: 15,
    timeLeft: "5h left",
    startDate: "2025-03-12",
    endDate: "2025-04-12",
  },
  {
    id: "6",
    title: "Hydration Heroes",
    description:
      "Drink 2 liters of water daily. Stay hydrated and healthy together.",
    totalStake: "CHF 80",
    memberCount: 20,
    timeLeft: "3h left",
    startDate: "2025-03-11",
    endDate: "2025-03-18",
  },
  {
    id: "7",
    title: "Guitar Practice Group",
    description:
      "Practice guitar for 30 minutes daily. Share progress and tips with fellow musicians.",
    totalStake: "CHF 250",
    memberCount: 7,
    timeLeft: "Today",
    startDate: "2025-03-11",
    endDate: "2025-04-11",
  },
  {
    id: "8",
    title: "Journaling Journey",
    description:
      "Write in your journal for 10 minutes every day. Reflect and grow together.",
    totalStake: "CHF 120",
    memberCount: 9,
    timeLeft: "Tonight",
    startDate: "2025-03-11",
    endDate: "2025-04-11",
  },
  {
    id: "9",
    title: "Push-up Challenge",
    description:
      "Complete 50 push-ups daily. Build strength and endurance as a team.",
    totalStake: "CHF 180",
    memberCount: 11,
    timeLeft: "4h left",
    startDate: "2025-03-11",
    endDate: "2025-03-18",
  },
  {
    id: "10",
    title: "Inbox Zero Masters",
    description:
      "Achieve inbox zero every day. Organize your digital life together.",
    totalStake: "CHF 200",
    memberCount: 4,
    timeLeft: "Today",
    startDate: "2025-03-11",
    endDate: "2025-03-18",
  },
  {
    id: "11",
    title: "Step Count Champions",
    description:
      "Walk 10,000 steps daily. Stay active and motivated with the group.",
    totalStake: "CHF 160",
    memberCount: 18,
    timeLeft: "11h left",
    startDate: "2025-03-11",
    endDate: "2025-03-18",
  },
  {
    id: "12",
    title: "Language Learning",
    description:
      "Practice a new language for 20 minutes daily. Learn together and stay accountable.",
    totalStake: "CHF 300",
    memberCount: 13,
    timeLeft: "7h left",
    startDate: "2025-03-10",
    endDate: "2025-04-10",
  },
];

export default function GroupsScreen() {
  return (
    <ScreenLayout>
      <CardList>
        {mockGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </CardList>
    </ScreenLayout>
  );
}

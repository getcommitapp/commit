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
    invitationCode: "MW-SQD-1A2B",
    goal: {
      id: "g-1",
      title: "Exercise 30m before 8AM",
      stake: "CHF 50",
      timeLeft: "2h left",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      streak: 5,
    },
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
    invitationCode: "STUDY-77XY",
    goal: {
      id: "g-2",
      title: "Study 4h focused",
      stake: "CHF 30",
      timeLeft: "6h left",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
    },
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
    invitationCode: "SUGAR-NOPE",
    goal: {
      id: "g-3",
      title: "No sugar for 7 days",
      stake: "CHF 20",
      timeLeft: "1d left",
      startDate: "2025-03-10",
      endDate: "2025-03-17",
      streak: 2,
    },
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
    invitationCode: "READ-4U",
    goal: {
      id: "g-4",
      title: "Read 50 pages/day",
      stake: "CHF 15",
      timeLeft: "8h left",
      startDate: "2025-03-15",
      endDate: "2025-04-15",
    },
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
    invitationCode: "ZEN-555",
    goal: {
      id: "g-5",
      title: "Meditate 15m daily",
      stake: "CHF 10",
      timeLeft: "5h left",
      startDate: "2025-03-12",
      endDate: "2025-04-12",
      streak: 10,
    },
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
    invitationCode: "H2O-2025",
    goal: {
      id: "g-6",
      title: "Drink 2L water/day",
      stake: "CHF 8",
      timeLeft: "3h left",
      startDate: "2025-03-11",
      endDate: "2025-03-18",
    },
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
    invitationCode: "GTR-AXE",
    goal: {
      id: "g-7",
      title: "Practice guitar 30m",
      stake: "CHF 25",
      timeLeft: "Today",
      startDate: "2025-03-11",
      endDate: "2025-04-11",
      streak: 3,
    },
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
    invitationCode: "JRN-10M",
    goal: {
      id: "g-8",
      title: "Journal 10m daily",
      stake: "CHF 12",
      timeLeft: "Tonight",
      startDate: "2025-03-11",
      endDate: "2025-04-11",
    },
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
    invitationCode: "PUSH-50",
    goal: {
      id: "g-9",
      title: "50 push-ups/day",
      stake: "CHF 18",
      timeLeft: "4h left",
      startDate: "2025-03-11",
      endDate: "2025-03-18",
    },
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
    invitationCode: "INBX-0",
    goal: {
      id: "g-10",
      title: "Inbox zero daily",
      stake: "CHF 20",
      timeLeft: "Today",
      startDate: "2025-03-11",
      endDate: "2025-03-18",
      streak: 1,
    },
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
    invitationCode: "STEP-10K",
    goal: {
      id: "g-11",
      title: "Walk 10k steps/day",
      stake: "CHF 16",
      timeLeft: "11h left",
      startDate: "2025-03-11",
      endDate: "2025-03-18",
    },
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
    invitationCode: "LINGO-20",
    goal: {
      id: "g-12",
      title: "Practice language 20m",
      stake: "CHF 30",
      timeLeft: "7h left",
      startDate: "2025-03-10",
      endDate: "2025-04-10",
    },
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

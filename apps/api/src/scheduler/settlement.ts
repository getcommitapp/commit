import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { StripeService } from "../services/stripeService";
import { computeState, todayLocal } from "../services/goalService";
import type { AppContext } from "../types";

// Helper to build a minimal AppContext-like object for StripeService
function buildContext(env: Env) {
  // Minimal shape used by StripeService: env.DB, env.STRIPE_SECRET_KEY, var.user
  const fake: {
    env: Env;
    var: { user: schema.UserSelect | null };
    set: (key: "user", value: schema.UserSelect | null) => void;
  } = {
    env,
    var: { user: null },
    set: (key: "user", value: schema.UserSelect | null) => {
      fake.var[key] = value;
    },
  };
  return fake as unknown as AppContext;
}

export async function runScheduledSettlements(env: Env) {
  const db = drizzle(env.DB, { schema });

  // --- LOAD ALL GOALS WITH GROUP RELATION TO DISTINGUISH SOLO VS GROUP ---
  const goals = await db.query.Goal.findMany({
    with: { group: true },
  });

  // --- SOLO SETTLEMENTS (goals without a linked group) ---
  for (const goal of goals.filter((g) => !g.group)) {
    // Owner context
    const [owner] = await db
      .select()
      .from(schema.User)
      .where(eq(schema.User.id, goal.ownerId))
      .limit(1);
    if (!owner) continue;

    const occurrenceDate = todayLocal(owner.timezone || "UTC");
    const [occ] = await db
      .select()
      .from(schema.GoalOccurrence)
      .where(
        and(
          eq(schema.GoalOccurrence.goalId, goal.id),
          eq(schema.GoalOccurrence.userId, owner.id),
          eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
        )
      )
      .limit(1);

    // Compute engine state for owner
    const state = computeState(goal, owner, occ ?? null);

    // If no occurrence and engine says failed or missed (e.g., checkin), create rejected occurrence
    if (!occ && (state.state === "failed" || state.state === "missed")) {
      const now = new Date();
      await db.insert(schema.GoalOccurrence).values({
        goalId: goal.id,
        userId: owner.id,
        occurrenceDate,
        status: "rejected",
        verifiedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    // If we have an occurrence and it's not pending, settle
    const effectiveOcc = occ
      ? occ
      : await db.query.GoalOccurrence.findFirst({
          where: (t, { and: _and, eq: _eq }) =>
            _and(
              _eq(t.goalId, goal.id),
              _eq(t.userId, owner.id),
              _eq(t.occurrenceDate, occurrenceDate)
            ),
        });

    if (effectiveOcc && effectiveOcc.status !== "pending") {
      if (effectiveOcc.status === "rejected") {
        // Debit the owner for rejected occurrence
        const ctx = buildContext(env);
        ctx.set("user", owner);
        const stripe = new StripeService(ctx);
        const customerId = await stripe.ensureStripeCustomerIdForUser(owner.id);
        await stripe.createPaymentIntent({
          amountCents: goal.stakeCents,
          currency: goal.currency,
          customerId,
          idempotencyKey: `${goal.id}:${occurrenceDate}:solo:debit:${owner.id}`,
        });
      }
      // For approved solo occurrences there is no redistribution to perform.
    }
  }

  // --- GROUP SETTLEMENTS ---
  // Find groups and evaluate occurrences for the groups' goal
  const groups = await db.query.Group.findMany({
    with: { goal: true, participants: true, creator: true },
  });

  for (const group of groups) {
    const goal = group.goal;
    if (!goal) continue;

    // Determine members: creator + participants
    const memberUserIds = Array.from(
      new Set([group.creatorId, ...group.participants.map((p) => p.userId)])
    );

    // Fetch occurrences for these users and this goal (across dates)
    const occs = await db
      .select()
      .from(schema.GoalOccurrence)
      .where(
        and(
          eq(schema.GoalOccurrence.goalId, goal.id),
          inArray(schema.GoalOccurrence.userId, memberUserIds)
        )
      );

    // Group by date
    const occsByDate = new Map<string, (typeof occs)[number][]>();
    for (const o of occs) {
      if (!occsByDate.has(o.occurrenceDate))
        occsByDate.set(o.occurrenceDate, []);
      occsByDate.get(o.occurrenceDate)!.push(o);
    }

    for (const [occurrenceDate, rows] of occsByDate) {
      if (goal.method === "movement") {
        // TODO: Implement group settlement logic for movement goals
        continue;
      }

      // Build per-member status map including members without a row
      const statusByUser = new Map<
        string,
        "approved" | "rejected" | "pending"
      >();
      for (const uid of memberUserIds) statusByUser.set(uid, "pending");
      for (const r of rows) statusByUser.set(r.userId, r.status);

      if (goal.method === "photo") {
        // Wait until all members are verified (no pending) before redistribution
        const anyPending = memberUserIds.some(
          (uid) => statusByUser.get(uid) === "pending"
        );
        if (anyPending) continue;
      }

      // For checkin: redistribute based on current statuses; treat missing as losers
      const winners = memberUserIds.filter(
        (uid) => statusByUser.get(uid) === "approved"
      );
      const losers = memberUserIds.filter(
        (uid) => (statusByUser.get(uid) as string) !== "approved"
      );

      if (winners.length === 0 || losers.length === 0) continue;

      // Debits for losers
      for (const loserId of losers) {
        const ctx = buildContext(env);
        const [loser] = await db
          .select()
          .from(schema.User)
          .where(eq(schema.User.id, loserId))
          .limit(1);
        if (!loser) continue;
        ctx.set("user", loser);
        const stripe = new StripeService(ctx);
        const customerId = await stripe.ensureStripeCustomerIdForUser(loserId);
        await stripe.createPaymentIntent({
          amountCents: goal.stakeCents,
          currency: goal.currency,
          customerId,
          idempotencyKey: `${group.id}:${occurrenceDate}:group:debit:${loserId}`,
        });
      }

      // Credits for winners: split evenly
      const totalPool = goal.stakeCents * losers.length;
      const perWinner = Math.floor(totalPool / winners.length);
      for (const winnerId of winners) {
        const ctx = buildContext(env);
        const [winner] = await db
          .select()
          .from(schema.User)
          .where(eq(schema.User.id, winnerId))
          .limit(1);
        if (!winner) continue;
        ctx.set("user", winner);
        const stripe = new StripeService(ctx);
        await stripe.creditCustomerBalance(
          perWinner,
          goal.currency,
          `Group ${group.id} payout ${occurrenceDate}`,
          `${group.id}:${occurrenceDate}:group:credit:${winnerId}`
        );
      }
    }
  }
}

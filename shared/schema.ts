import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't strictly need a backend for this static-like app, 
// but we'll define a simple 'visits' table just to track usage if needed,
// and to satisfy the architecture requirements.

export const game_sessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").default(0),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertGameSessionSchema = createInsertSchema(game_sessions).omit({ 
  id: true, 
  completedAt: true 
});

export type GameSession = typeof game_sessions.$inferSelect;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;

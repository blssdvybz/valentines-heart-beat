import { game_sessions, type GameSession, type InsertGameSession } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSession(session: InsertGameSession): Promise<GameSession>;
}

export class DatabaseStorage implements IStorage {
  async createSession(insertSession: InsertGameSession): Promise<GameSession> {
    const [session] = await db
      .insert(game_sessions)
      .values(insertSession)
      .returning();
    return session;
  }
}

export const storage = new DatabaseStorage();

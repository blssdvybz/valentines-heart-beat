import { game_sessions, type GameSession, type InsertGameSession } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSession(session: InsertGameSession): Promise<GameSession>;
}

export class DatabaseStorage implements IStorage {
  async createSession(insertSession: InsertGameSession): Promise<GameSession> {
    // @ts-ignore
    const [session] = await db
      .insert(game_sessions)
      .values(insertSession)
      .returning();
    return session;
  }
}

export class MemStorage implements IStorage {
  private sessions: Map<number, GameSession>;
  private currentId: number;

  constructor() {
    this.sessions = new Map();
    this.currentId = 1;
  }

  async createSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = this.currentId++;
    const session: GameSession = {
      ...insertSession,
      id,
      completedAt: new Date(),
      score: insertSession.score ?? 0
    };
    this.sessions.set(id, session);
    return session;
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { DEFAULT_STACKS, type Stack } from "@/lib/board-types";

const TaskSchema = z.object({
  id: z.string().min(1).max(64),
  text: z.string().max(200),
  done: z.boolean(),
  createdAt: z.number(),
  completedAt: z.number().nullable(),
});

const StackSchema = z.object({
  id: z.string().min(1).max(64),
  title: z.string().min(1).max(32),
  tasks: z.array(TaskSchema).max(200),
});

const BoardSchema = z.array(StackSchema).min(1).max(16);

function parseStacks(value: unknown): Stack[] {
  if (typeof value === "string") return BoardSchema.parse(JSON.parse(value));
  return BoardSchema.parse(value);
}

export const getBoard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ stacks: unknown }>`
      select stacks from boards where user_id = ${context.userId}
    `;
    if (rows[0]) {
      return { stacks: parseStacks(rows[0].stacks), isNew: false };
    }
    const stacks = DEFAULT_STACKS;
    await sql.query(
      `insert into boards (user_id, stacks) values ($1, $2::jsonb)
       on conflict (user_id) do nothing`,
      [context.userId, JSON.stringify(stacks)],
    );
    return { stacks, isNew: true };
  });

export const saveBoard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => BoardSchema.parse(input))
  .handler(async ({ context, data: stacks }) => {
    const sql = await getSql();
    await sql.query(
      `insert into boards (user_id, stacks, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (user_id) do update
         set stacks = excluded.stacks, updated_at = now()`,
      [context.userId, JSON.stringify(stacks)],
    );
    return { ok: true as const };
  });

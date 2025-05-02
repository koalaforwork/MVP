import { sql } from 'drizzle-orm';
import {
    pgTable,
    text,
    timestamp,
    integer,
    json,
    uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    userId:
    uuid('user_id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    preferences: json('preferences').$type<{
        workHours: { start: string; end: string };
        focusSessionDuration: number;
        breakDuration: number;
        notificationPreferences: Record<string, any>;
    }>().notNull(),
    emotionalPatterns:
    json('emotional_patterns').$type<{
        commonTriggers: string[];
        effectiveTechniques: string[];
        energyPeaktimes: string[];
    }>().notNull(),
    workStyle: json('work_style').$type<{
        preferTaskTypes: string[];
        contextSwitchingStyle: string[];
        decisionMakingStyle: string[];
    }>().notNull(),
});

export const tasks = pgTable('tasks', {
    taskId:
    uuid('task_id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.userId),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').notNull().default('not started'),
    priority: integer('priority'),
    dueDate: timestamp('due_date'),
    estimatedDuration: integer('estimated_duration'),
    emotionalWeight: integer('emotional_weight').notNull().default(1).$defaultFn(() => sql`CASE WHEN emotional_weight > 10 THEN 10 WHEN emotional_weight < 1 THEN 1 ELSE emotional_weight END`),
    context: json('context').$type<{
        project: string;
        relatedTasks: string[];
        resources: string[];
        notes: string;
    }>(),
    sessions: json('sessions').$type<{
        startTime: string;
        endtime: string;
        progress: string;
        emotionalState: string;
    }[]>(),
});

export const emotionalStates =
pgTable('emotional_states', {
    stateId: uuid('state_id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.userId),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
    primaryEmotion: text('primary_emotion').notNull(),
    intensity: integer('intensity'),
    trigger: text('trigger'),
    context: text('trigger'),
    associatedTasks: json('associated_tasks').$type<string[]>(),
    regulationTechniques: json('regulation_techniques').$type<{
        technique: string;
        effectiveness: number;
    }[]>(),
});
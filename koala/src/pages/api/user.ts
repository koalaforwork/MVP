import type { NextApiRequest, NextApiResponse } from 'next';
import { db} from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const defaultPreferences = {
  workHours: { start: '09:00', end: '17:00' },
  focusSessionDuration: 25,
  breakDuration: 5,
  notificationPreferences: { email: true, push: false },
};
const defaultEmotionalPatterns = {
  commonTriggers: [],
  effectiveTechniques: [],
  energyPeaktimes: []
};
const defaultWorkStyle = {
  preferTaskTypes: [],
  contextSwitchingStyle: [],
  decisionMakingStyle: []
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { userId, email } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user ID' });
    }

    const existingUser = await db.select()
      .from(users)
      .where(eq(users.name, email.split('@')[0]))
      .limit(1);


    if (existingUser.length > 0) {

      if (existingUser[0],userId !== userId) {
        await db.update(users)
        .set({userId: userId})
        .where(eq(users.userId, existingUser[0].userId));
      }

      return res.status(200).json({ success: true, message: "User already exists in database." });
    }

    const existingUserById = await db.select()
    .from(users)
    .where(eq(users.userId, userId))
    .limit(1);

    if (existingUserById.length > 0) {
      return res.status(200).json({
        success: true,
        message: "User already exists in database.",
        user: existingUserById[0],
      });
    }


      const defaultName = email ? email.split('@')[0] : 'New User';

      await db.insert(users).values({
        userId: userId,
        name: defaultName,
        preferences: defaultPreferences,
        emotionalPatterns: defaultEmotionalPatterns,
        workStyle: defaultWorkStyle,
      })
      .onConflictDoNothing();
      return res.status(200).json({ success: true, message: "User created in database." });

  } catch (dbError: any) {
    if (!res.headersSent) {
       res.status(500).json({ success: false, error: dbError.message || 'Failed to set up user profile.' });
    }
  }
}

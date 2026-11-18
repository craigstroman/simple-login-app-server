import passport from 'passport';
import { getRepository } from 'typeorm';
import { google } from './Google';
import { User as Users } from '../entities/USER';

export const auth = () => {
  passport.serializeUser((user, done) => {
    done(null, (user as Users).id);
  });

  passport.deserializeUser(async (id: unknown, done) => {
    try {
      const userId = Number(id);

      if (!Number.isSafeInteger(userId) || userId <= 0) {
        return done(new Error('Invalid user ID'));
      }

      const user = await getRepository(Users).findOne({
        where: { id: userId },
      });

      done(null, user || false);
    } catch (error) {
      done(error);
    }
  });

  // Register Google OAuth strategy
  google();

  console.log('Registered strategies:', Object.keys((passport as any)._strategies));
};

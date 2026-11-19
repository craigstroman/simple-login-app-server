import passport from 'passport';
import { google } from './oauth/Google';

export const auth = () => {
  passport.serializeUser(function (Users: User, done) {
    done(null, Users);
  });

  passport.deserializeUser(function (Users: User, done) {
    done(null, Users);
  });

  // Register Google OAuth strategy
  google();

  console.log('Registered strategies:', Object.keys((passport as any)._strategies));
};

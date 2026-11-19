import path from 'path';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { findOrCreate } from '../database';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const google = async () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:9001/auth/google/callback',
      },
      async function (accessToken, refreshToken, profile: Profile, cb) {
        try {
          const user = await findOrCreate(profile.id, profile);

          console.log('user: ', user);

          /*f (req.session) {
            req.session.userId = profile.id;
          }*/

          return cb(null, user);
        } catch (error) {
          console.log('There was an error creating the user.');
          console.log('error: ', error);
          return error;
        }
      },
    ),
  );
};

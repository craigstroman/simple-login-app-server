import path from 'path';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { getConnection } from 'typeorm';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { User as Users } from '../entities/USER';

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
          const hashedPassword = await argon2.hash('testDome12!');
          const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Users)
            .values({
              first_name: profile.name?.givenName || profile._json.given_name || '',
              last_name: profile.name?.familyName || profile._json.family_name || '',
              username: profile.emails?.[0]?.value?.toLowerCase() || '',
              email: profile.emails?.[0]?.value?.toLowerCase() || '',
              password: hashedPassword,
              login_type: 'Google OAuth',
            })
            .returning('*')
            .execute();

          const user = result.raw[0];

          if (user) {
            return cb(null, user);
          }
        } catch (error) {
          console.log('There was an error creating the user.');
          console.log('error: ', error);
          return error;
        }
      },
    ),
  );
};

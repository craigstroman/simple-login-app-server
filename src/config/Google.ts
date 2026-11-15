import path from 'path';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import { getConnection, getRepository } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/USER';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3000/auth/google/secrets',
    },
    function (accessToken, refreshToken, profile, cb) {
      const googleProfile = profile as unknown as GoogleProfile;
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          first_name: googleProfile.given_name,
          last_name: googleProfile.family_name,
          username: googleProfile.sub,
          email: (googleProfile.emails[0].value || '').toLowerCase(),
          password: '',
        })
        .returning('*')
        .execute();
    },
  ),
);

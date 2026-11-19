import { getConnection } from 'typeorm';
import argon2 from 'argon2';
import { User } from '../entities/USER';

export const findOrCreate = async (id: string, profile) => {
  const user = await User.createQueryBuilder('user')
    .where('user.oauth_id = :value', {
      value: id,
    })
    .getOne();

  if (user) {
    return user;
  } else {
    const hashedPassword = await argon2.hash('testDome12!');
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          first_name: profile.name?.givenName || profile._json.given_name || '',
          last_name: profile.name?.familyName || profile._json.family_name || '',
          username: profile.emails?.[0]?.value?.toLowerCase() || '',
          email: profile.emails?.[0]?.value?.toLowerCase() || '',
          password: hashedPassword,
          login_type: 'Google OAuth',
          oauth_id: profile.id,
        })
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (error) {
      console.log('There was an error inserting into the database.');
      console.log('error: ', error);
    }
  }
};

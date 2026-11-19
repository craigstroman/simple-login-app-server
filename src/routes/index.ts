import path from 'path';
import { Router, Response, Request } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { indexPage } from '../controllers/index/index';
import { postRegister } from '../controllers/register/register';
import { postLogin } from '../controllers/login/login';
import { postLogout } from '../controllers/logout/logout';
import { postForgotPassword } from '../controllers/forgot-password/forgotPassword';
import { changePassword } from '../controllers/change-password/changePassword';
import { isLoggedIn } from '../controllers/isLoggedIn/isLoggedIn';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// TODO: Continue implementing Facebook login

const router = Router();

router.route('/').get(indexPage);

router.route('/dashboard').get(indexPage);

router.route('/register').post(postRegister);

router.route('/login').post(postLogin);

router.route('/logout').post(postLogout);

router.route('/forgot-password').post(postForgotPassword);

router.route('/change-password').post(changePassword);

router.route('/api/is-logged-in').get(isLoggedIn);

router.route('/auth/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/auth/google/callback').get(
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  async (req: Request, res: Response) => {
    const user = (await req.user) as User | undefined;

    if (!user) {
      console.log('User is undefined');
      res.redirect('http://localhost:8080/login');
      return;
    }

    if (user && req.session) {
      req.session.userId = user?.id;
    }

    if (req.session) {
      req.session.save((error) => {
        if (error) {
          console.error('Session save error:', error);
          return res.status(500).send('Session error');
        }

        return res.status(200);
        console.log('Session saved successfully');
      });
    }

    res.redirect(process.env.NODE_ENV === 'development' ? 'http://localhost:8080/dashboard' : '/dashboard');
  },
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:8080/login',
  }),
  async (_req: Request, res: Response) => {
    res.redirect('http://localhost:8080/login');
  },
);

export default router;

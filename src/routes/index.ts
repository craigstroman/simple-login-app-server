import { Router, Response, Request } from 'express';
import passport from 'passport';
import { indexPage } from '../controllers/index/index';
import { postRegister } from '../controllers/register/register';
import { postLogin } from '../controllers/login/login';
import { postLogout } from '../controllers/logout/logout';
import { postForgotPassword } from '../controllers/forgot-password/forgotPassword';
import { changePassword } from '../controllers/change-password/changePassword';
import { isLoggedIn } from '../controllers/isLoggedIn/isLoggedIn';

// TODO: Setup a server side dashboard page that redirects to indexpage for Google OAuth.

const router = Router();

router.route('/').get(indexPage);

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
  (req: Request, res: Response) => {
    res.redirect('/dashboard');
  },
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:8080/login',
  }),
  (req, res) => {
    console.log('Google authentication successful');
    res.redirect('http://localhost:8080/login');
  },
);

export default router;

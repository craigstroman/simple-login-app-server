import { Router } from 'express';
import { isLoggedIn } from '../controllers/isLoggedIn/isLoggedIn';

const router = Router();

router.route('/is-logged-in').get(isLoggedIn);

export default router;

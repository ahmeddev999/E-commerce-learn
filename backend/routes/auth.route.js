import express from 'express';
import { login, logout, singup, refreshToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/singup', singup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh-token', refreshToken);

// pewestman ba shtaka hata aw route bprarezin awesh middleware e protectRoute a
// router.get('/get-profile', getProfile);
export default router;
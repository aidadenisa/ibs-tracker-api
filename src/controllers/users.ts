// @ts-expect-error TS(2792): Cannot find module 'express'. Did you mean to set ... Remove this comment to see the full error message
import express from 'express';
// @ts-expect-error TS(2792): Cannot find module '../../services/users'. Did ... Remove this comment to see the full error message
import userService from '../../services/users';

const router = express.Router();

router.get('/currentUser', async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.user.id, req.query.populate);
    res.json(result);
  } catch (err) { next(err) }
});

export default router;
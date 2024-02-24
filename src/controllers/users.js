import express from 'express';
import userService from '../../services/users.js';

const router = express.Router();

router.get('/currentUser', async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.user.id, req.query.populate);
    res.json(result);
  } catch (err) { next(err) };
});

export default router;
// @ts-expect-error TS(2792): Cannot find module 'express'. Did you mean to set ... Remove this comment to see the full error message
import express from 'express';
import categoriesService from '../services/categories.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await categoriesService.getCategories(req.query.populate);
    return res.status(200).json(result);
  } catch (err) { next(err) }
});

export default router;
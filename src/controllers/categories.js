import express from 'express';
import categoriesService from '../services/categories.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await categoriesService.getCategories(req.query.populate);
    return res.status(200).json(result);
  } catch (err) { next(err) };
});

export default router;
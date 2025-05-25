import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getReviews, addReview, removeReview } from './review.controller.js'

export const reviewRoutes = express.Router()

reviewRoutes.get('/', log, getReviews)
reviewRoutes.post('/',requireAuth,  addReview)
reviewRoutes.delete('/:id', requireAuth, removeReview)

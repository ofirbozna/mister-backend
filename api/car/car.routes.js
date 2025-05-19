import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getCars, getCarById, addCar, updateCar, removeCar, addCarMsg, removeCarMsg } from './car.controller.js'

export const carRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

carRoutes.get('/', log, getCars)
carRoutes.get('/:id', getCarById)
carRoutes.post('/', requireAuth, addCar)
carRoutes.put('/:id', requireAuth, updateCar)
carRoutes.delete('/:id', requireAdmin, requireAuth, removeCar)

carRoutes.post('/:id/msg', requireAuth, addCarMsg)
carRoutes.delete('/:id/msg/:msgId', requireAdmin, requireAuth, removeCarMsg)
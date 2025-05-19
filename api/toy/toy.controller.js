import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'

export async function getToys(req, res) {
    try {
        const labels = req.query.labels
        const filterBy = {
            txt: req.query.txt || '',
            inStock: req.query.inStock === 'true' || req.query.inStock === 'false' ? JSON.parse(req.query.inStock) : '',
            labels: Array.isArray(labels)
                ? labels
                : labels
                    ? [labels]
                    : [],
            price: req.query.price ? +req.query.price : 0,
            sortBy: req.query.sortBy || ''
        }
        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.send(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    // const { loggedinUser } = req

    try {
        const toy = req.body
        // car.owner = loggedinUser
        const addedToy = await toyService.add(toy)
        res.send(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const toy = { ...req.body, _id: req.params.id }
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const toyId = req.params.id
        const deletedCount = await toyService.remove(toyId)
        res.send(`${deletedCount} toys removed`)
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
            createdAt: Date.now(),
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const { msgId } = req.params
        if (loggedinUser) {
            const removedId = await toyService.removeToyMsg(toyId, msgId)
            res.send(removedId)
        }
    } catch (err) {
        logger.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}
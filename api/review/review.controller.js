import { reviewService }from '../review/review.service.js'
import { logger } from '../../services/logger.service.js'

export async function getReviews(req, res) {
    try {
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        logger.error('Cannot get reviews', err)
        res.status(400).send({ err: 'Failed to get reviews' })
    }
}


export async function addReview(req, res) {
    const { loggedinUser } = req

    try {
        const review = req.body
        // const { aboutToyId } = review
        review.byUserId = loggedinUser._id
        const addedReview = await reviewService.add(review)
        res.send(addedReview)
    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}

export async function removeReview(req, res) {
    try {
        const reviewId = req.params.id
        const deletedCount = await reviewService.remove(reviewId)
        res.send(`${deletedCount} reviews removed`)
    } catch (err) {
        logger.error('Failed to remove review', err)
        res.status(500).send({ err: 'Failed to remove review' })
    }
}


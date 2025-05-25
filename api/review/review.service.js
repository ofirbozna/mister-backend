import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

export const reviewService = {
    remove,
    query,
    add,
}

async function query(filterBy={}) {
    console.log(filterBy)
    try {
        const criteria = _buildCriteria(filterBy)
        console.log(criteria)
        const collection = await dbService.getCollection('review')
        const pipeline = [
            {
                $match: criteria,
            },
            {
                $lookup: {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser',
                },
            },
            { $unwind: '$byUser' },
            {
                $lookup: {
                    localField: 'aboutToyId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'aboutToy',
                },
            },
            { $unwind: '$aboutToy' },
            {
                $addFields: {
                    createdAt: { $toDate: '$_id' }
                }
            }
        ]

        if (filterBy.userName) {
            pipeline.push({
                $match: {
                    'byUser.fullname': { $regex: filterBy.userName, $options: 'i' }
                }
            })
        }

        if (filterBy.toyName) {
            pipeline.push({
                $match: {
                    'aboutToy.name': { $regex: filterBy.toyName, $options: 'i' }
                }
            })
        }

        if (filterBy.createdAt) {
            const createdAtDate = new Date(filterBy.createdAt)
            pipeline.push({
                $match: {
                    createdAt: { $gte: createdAtDate }
                }
            })
        }

        pipeline.push({
            $project: {
                txt: true,
                createdAt: { $toDate: '$_id' },
                'byUser._id': true,
                'byUser.fullname': true,
                'aboutToy._id': true,
                'aboutToy.name': true,
                'aboutToy.price': true,
            },
        })
        const reviews = await collection.aggregate(pipeline).toArray()
        console.log(reviews)
        return reviews
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }
}


async function remove(reviewId) {
    try {
        const { loggedinUser } = asyncLocalStorage.getStore()
        const collection = await dbService.getCollection('review')

        const criteria = { _id: ObjectId.createFromHexString(reviewId) }

        if (!loggedinUser.isAdmin) {
            criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)
        }

        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    try {
        const reviewToAdd = {
            byUserId: ObjectId.createFromHexString(review.byUserId),
            aboutToyId: ObjectId.createFromHexString(review.aboutToyId),
            txt: review.txt,
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd
    } catch (err) {
        loggerService.error('cannot add review', err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.byUserId) {
        criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
    }

    if (filterBy.aboutToyId) {
        criteria.aboutToyId = ObjectId.createFromHexString(filterBy.aboutToyId)
    }

    return criteria
}

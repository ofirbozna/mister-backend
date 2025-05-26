import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg,
}

async function query(filterBy = { txt: '', inStock: '', labels: [], sortBy: 'name', price: '' }) {
    try {
        const criteria = getCriteria(filterBy)
        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria.filterBy).sort(criteria.sortCriteria).toArray()
        console.log(toys)
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

function getCriteria(filterBy) {
    const filterCriteria = {}
    if (filterBy.txt) {
        filterCriteria.name = { $regex: filterBy.txt, $options: 'i' }
    }

    if (filterBy.inStok) {
        filterCriteria.inStok = JSON.parse(filterBy.inStok)
    }

    if (filterBy.price) {
        filterCriteria.price = { $lt: filterBy.price }
    }

    if (filterBy.labels?.length) {
        filterCriteria.labels = { $all: filterBy.labels }

    }

    const sortCriteria = {}
    if (filterBy.sortBy) {
        sortCriteria[filterBy.sortBy] = 1
    }
    return { filterCriteria, sortCriteria }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
        toy.createdAt = toy._id.getTimestamp()
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove toy${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const { name, price, inStock, labels, imgUrl } = toy
        const toyToSave = {
            name,
            price: +price,
            labels,
            inStock,
            imgUrl
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${carId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot remove msg ${toyId}`, err)
        throw err
    }
}
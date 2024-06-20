const Term  = require("../models/TermModel")
const mongoose = require('mongoose');

const createTerm = (newTerm) => {
    return new Promise(async (resolve, reject) => {
        if (!newTerm) {
            return reject(new TypeError("New Course data is required"));
        }

        const { name, startDate, endDate } = newTerm

        try {
            const existingTerm = await Term.findOne({ name });
            if (existingTerm) {
                return resolve({
                    status: 'ERR',
                    message: 'Name already exists'
                });
            }

            // Validate and cast each term ID in the departments array to ObjectId
            // if (!departments.every(department => mongoose.Types.ObjectId.isValid(department))) {
            //     throw new Error("Invalid department ID format in departments");
            // }
            // newTerm.departments = departments.map(department => new mongoose.Types.ObjectId(department));

            const createdTerm = await Term.create(newTerm);

            if (createdTerm) {
                resolve({
                    status: 'OK',
                    message: 'Term successfully created',
                    data: createdTerm
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating Term',
                error: e.message
            });
        }
    });
};

const updateTerm = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkTerm = await Term.findOne({
                _id:id
            })
            if (checkTerm === null) {
                resolve({
                    status: 'OK',
                    message: 'The Term is not defined'
                })
            }

            const updateTerm = await Term.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateTerm
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const deleteTerm = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkTerm = await Term.findOne({
                _id:id
            })
            if (checkTerm === null) {
                resolve({
                    status: 'OK',
                    message: 'The Term is not defined'
                })
            }

            await Term.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete Term success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllTerm = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allTerm = await Term.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allTerm
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPaginationTerm = async (limit = 4, page = 0, filter) => {
    try {
        const totalTerms = await Term.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const terms = await Term.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: terms,
            total: totalTerms,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalTerms / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationTopic:', e);
        throw new Error('Failed to retrieve topics');
    }
}


const getDetailsTerm = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const term = await Term.findOne({
                _id:id
            })
            if (term === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Term not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: term
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createTerm,
    updateTerm,
    deleteTerm,
    getAllTerm,
    getDetailsTerm,
    getPaginationTerm
}
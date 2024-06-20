const Slot  = require("../models/SlotModel")
const mongoose = require('mongoose');

const createSlot = (newSlot) => {
    return new Promise(async (resolve, reject) => {


        if (!newSlot) {
            return reject(new TypeError("New Course data is required"));
        }

        const { startTime, endTime, courseId, termId, roomId } = newSlot

        try {
            const existingSlot = await Slot.findOne({ startTime, endTime, courseId });
            if (existingSlot) {
                return resolve({
                    status: 'ERR',
                    message: 'Slot already exists'
                });
            }

            // Cast course to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                throw new Error("Invalid course ID format");
            }
            newSlot.courseId = new mongoose.Types.ObjectId(courseId);

            // Cast termId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(termId)) {
                throw new Error("Invalid term ID format");
            }
            newSlot.termId = new mongoose.Types.ObjectId(termId);

            // Cast roomId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                throw new Error("Invalid room ID format");
            }
            newSlot.roomId = new mongoose.Types.ObjectId(roomId);

            const createdSlot = await Slot.create(newSlot);

            if (createdSlot) {
                resolve({
                    status: 'OK',
                    message: 'Slot successfully created',
                    data: createdSlot
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating Slot',
                error: e.message
            });
        }
    });
};

const updateSlot = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkSlot = await Slot.findOne({
                _id:id
            })
            if (checkSlot === null) {
                resolve({
                    status: 'OK',
                    message: 'The Slot is not defined'
                })
            }

            const updateSlot = await Slot.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateSlot
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const deleteSlot = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkSlot = await Slot.findOne({
                _id:id
            })
            if (checkSlot === null) {
                resolve({
                    status: 'OK',
                    message: 'The Slot is not defined'
                })
            }

            await Slot.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete Slot success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllSlot = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allSlot = await Slot.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allSlot
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPaginationSlot = async (limit = 4, page = 0, filter) => {
    try {
        const totalSlots = await Slot.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const slots = await Slot.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: slots,
            total: totalSlots,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalSlots / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationSlot:', e);
        throw new Error('Failed to retrieve slots');
    }
}

const getDetailsSlot = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const slot = await Slot.findOne({
                _id:id
            })
            if (slot === null) {
                resolve({
                    status: 'OK',
                    message: 'The slot not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: slot
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSlot,
    updateSlot,
    deleteSlot,
    getAllSlot,
    getDetailsSlot,
    getPaginationSlot
}
const Room  = require("../models/RoomModel")



const createRoom = (newRoom) => {
    return new Promise(async (resolve, reject) => {
        if (!newRoom) {
            return reject(new TypeError("New room data is required"));
        }
        

        const { building, capacity, features } = newRoom;

        try {
            const existingRoom = await Room.findOne({ building });
            if (existingRoom) {
                return resolve({
                    status: 'ERR',
                    message: 'building already exists'
                });
            }

            const createdRoom = await Room.create(newRoom);

            if (createdRoom) {
                resolve({
                    status: 'OK',
                    message: 'Room successfully created',
                    data: createdRoom
                });
            }
        } catch (e) {
            console.log('service', e)

            reject({
                status: 'ERR',
                message: 'Error creating user',
                error: e.message
            });
        }
    });
};

const updateRoom = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRoom = await Room.findOne({
                _id:id
            })
            console.log('checkUser', checkRoom)
            if (checkRoom === null) {
                resolve({
                    status: 'OK',
                    message: 'The Room is not defined'
                })
            }

            const updateRoom = await Room.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateRoom
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteRoom = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRoom = await Room.findOne({
                _id:id
            })
            if (checkRoom === null) {
                resolve({
                    status: 'OK',
                    message: 'The email is not defined'
                })
            }

            await Room.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete Room success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllRoom = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRoom = await Room.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allRoom
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPaginationRoom = async (limit = 4, page = 0, filter) => {
    try {
        const totalRooms = await Room.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const rooms = await Room.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: rooms,
            total: totalRooms,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalRooms / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationRoom:', e);
        throw new Error('Failed to retrieve rooms');
    }
}

const getDetailsRoom = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const room = await Room.findOne({
                _id:id
            })
            if (room === null) {
                resolve({
                    status: 'OK',
                    message: 'The room not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: room
            })
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createRoom,
    updateRoom,
    deleteRoom,
    getAllRoom,
    getDetailsRoom,
    getPaginationRoom
}
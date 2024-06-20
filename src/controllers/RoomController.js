const RoomService = require('../services/RoomService')

const createRoom = async(req, res) => {
    try {
        const { building, capacity, features } = req.body;
        
        if (!building || !capacity || !Array.isArray(features)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        } 

        const response = await RoomService.createRoom(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log('controller', e)
        return res.status(500).json({
            status: 'ERR',
            message: 'Server error',
            error: e.message
        });
    }
};

const updateRoom = async(req, res) => {
    try {
        const roomId = req.params.id
        const data = req.body
        if (!roomId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The roomId is required'
            })
        }
        const response = await RoomService.updateRoom(roomId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteRoom = async(req, res) => {
    try {
        const roomId = req.params.id
        // const token = req.headers
        if (!roomId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The roomId is required'
            })
        }
        const response = await RoomService.deleteRoom(roomId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllRoom = async(req, res) => {
    try {
        const response = await RoomService.getAllRoom()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationRoom = async(req, res) => {
    try {
        const {limit, page, filter} = req.query
        const response = await RoomService.getPaginationRoom(Number(limit), Number(page), filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsRoom = async (req, res) => {
    try {
        const roomId = req.params.id
        // const token = req.headers
        if (!roomId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The roomId is required'
            })
        }
        const response = await RoomService.getDetailsRoom(roomId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createRoom,
    updateRoom,
    deleteRoom,
    getAllRoom,
    getDetailsRoom,
    getPaginationRoom
}
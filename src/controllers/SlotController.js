const SlotService = require('../services/SlotService')

const createSlot = async(req, res) => {
    try {
        const { startTime, endTime, courseId, termId, roomId } = req.body;
        

        if (!startTime || !endTime || !courseId || !termId || !roomId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }
        const response = await SlotService.createSlot(req.body);
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

const updateSlot = async(req, res) => {
    try {
        const SlotId = req.params.id
        const data = req.body
        if (!SlotId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The SlotId is required'
            })
        }
        const response = await SlotService.updateSlot(SlotId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteSlot = async(req, res) => {
    try {
        const SlotId = req.params.id
        // const token = req.headers
        if (!SlotId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The SlotId is required'
            })
        }
        const response = await SlotService.deleteSlot(SlotId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllSlot = async(req, res) => {
    try {
        const response = await SlotService.getAllSlot()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationSlot = async(req, res) => {
    try {
        const {limit, page, filter} = req.query
        const response = await SlotService.getPaginationSlot(Number(limit), Number(page), filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsSlot = async (req, res) => {
    try {
        const SlotId = req.params.id
        // const token = req.headers
        if (!SlotId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The SlotId is required'
            })
        }
        const response = await SlotService.getDetailsSlot(SlotId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createSlot,
    updateSlot,
    deleteSlot,
    getAllSlot,
    getDetailsSlot,
    getPaginationSlot
}
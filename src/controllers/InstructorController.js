const InstructorService = require('../services/InstructorService')

const createInstructor = async(req, res) => {
    try {
        const { name, departmentId, email, officeHours } = req.body;
        
        // Regular expression for email validation
        const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isCheckEmail = reg.test(email);

        if (!name || !departmentId|| !email|| !officeHours) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid email format'
            });
        }
        const response = await InstructorService.createInstructor(req.body);
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

const updateInstructor = async(req, res) => {
    try {
        const InstructorId = req.params.id
        const data = req.body
        if (!InstructorId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The InstructorId is required'
            })
        }
        const response = await InstructorService.updateInstructor(InstructorId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteInstructor = async(req, res) => {
    try {
        const InstructorId = req.params.id
        // const token = req.headers
        if (!InstructorId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The InstructorId is required'
            })
        }
        const response = await InstructorService.deleteInstructor(InstructorId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllInstructor = async(req, res) => {
    try {
        const response = await InstructorService.getAllInstructor()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsInstructor = async (req, res) => {
    try {
        const InstructorId = req.params.id
        // const token = req.headers
        if (!InstructorId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The InstructorId is required'
            })
        }
        const response = await InstructorService.getDetailsInstructor(InstructorId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationInstructor = async(req, res) => {
    try {
        const {limit, page, filter} = req.query
        const response = await InstructorService.getPaginationInstructor(Number(limit), Number(page), filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const instructorSchedule = async (req, res) => {
    try {
        const instructorId = req.params.id; // Ensure this matches your route parameter naming

        // Validate required input
        if (!instructorId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The instructorId is required.'
            });
        }

        const schedule = await InstructorService.instructorSchedule(instructorId);
        
        if (!schedule || schedule.length === 0) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Schedule not found.'
            });
        }

        // Successful response with the schedule
        return res.status(200).json({
            status: 'OK',
            data: schedule
        });
    } catch (e) {
        console.error('Error fetching schedule:', e);
        return res.status(500).json({
            status: 'ERR',
            message: 'An error occurred while fetching the schedule.',
            error: e.toString()
        });
    }
}


module.exports = {
    createInstructor,
    updateInstructor,
    deleteInstructor,
    getAllInstructor,
    getDetailsInstructor,
    getPaginationInstructor,
    instructorSchedule
}
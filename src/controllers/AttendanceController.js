const AttendanceService = require('../services/AttendanceService')

const createAttendance = async(req, res) => {
    try {
        const { studentId, instructorId, slotId, courseId, termId, departmentId, date } = req.body;

        if (!studentId || !instructorId || !slotId || !slotId || !courseId  || !termId|| !departmentId || !date) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }
        const response = await AttendanceService.createAttendance(req.body);
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

const updateAttendance = async(req, res) => {
    try {
        const AttendanceId = req.params.id
        const data = req.body
        if (!AttendanceId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The AttendanceId is required'
            })
        }
        const response = await AttendanceService.updateAttendance(AttendanceId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteAttendance = async(req, res) => {
    try {
        const AttendanceId = req.params.id
        // const token = req.headers
        if (!AttendanceId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The AttendanceId is required'
            })
        }
        const response = await AttendanceService.deleteAttendance(AttendanceId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllAttendance = async(req, res) => {
    try {
        const response = await AttendanceService.getAllAttendance()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsAttendance = async (req, res) => {
    try {
        const AttendanceId = req.params.id
        // const token = req.headers
        if (!AttendanceId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The AttendanceId is required'
            })
        }
        const response = await AttendanceService.getDetailsAttendance(AttendanceId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationAttendance = async (req, res) => {
    const { page, limit, filter } = req.query

    try {
        const response = await AttendanceService.getPaginationAttendance(Number(limit), Number(page), filter)
        return res.status(200).json(response);
    } catch (error) {
        console.error('Pagination Error:', error);
        return res.status(500).json({
            message: 'Error fetching paginated attendance',
            error: error.message
        });
    }
    
}

const updateMultipleAttendanceRecords = async (req, res) => {
    try {
        // Now expecting req.body to be an array of objects, each with a studentId and a status
        const attendanceUpdates = req.body;

        // Basic validation to ensure the request body is an array and contains the required fields
        if (!Array.isArray(attendanceUpdates) || attendanceUpdates.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'A non-empty array of attendance updates is required.'
            });
        }
        console.log("attendanceUpdates", attendanceUpdates)

        const hasInvalidEntries = attendanceUpdates.some(update => !update.attendanceId || typeof update.status !== 'string');
        if (hasInvalidEntries) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Each update must include a id and a status.'
            });
        }

        // Call the service function to update multiple attendance records
        const results = await AttendanceService.updateMultipleAttendanceRecords(attendanceUpdates);

        // Handle partial success/failure by checking if any of the results contain an error
        const allSuccessful = results.every(result => !result.error);

        if (allSuccessful) {
            return res.status(200).json({
                status: 'OK',
                message: 'All attendance records updated successfully',
                results
            });
        } else {
            // If there are any errors, you could choose to still return a 200 status but indicate partial success
            // Alternatively, you might return a different status code depending on your API design principles
            return res.status(200).json({
                status: 'Partial OK',
                message: 'Some attendance records could not be updated',
                results
            });
        }
    } catch (e) {
        console.error('control', e); // Detailed logging for debugging
        return res.status(500).json({
            status: 'ERR',
            message: 'An error occurred while updating multiple attendance statuses.'
        });
    }
};







module.exports = {
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAllAttendance,
    getDetailsAttendance,
    updateMultipleAttendanceRecords,
    getPaginationAttendance
}
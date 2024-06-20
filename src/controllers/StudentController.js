const StudentService = require('../services/StudentService')

const createStudent = async(req, res) => {
    try {
        const { name, email, departmentId, enrolledCourses } = req.body;
        
        // Regular expression for email validation
        const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isCheckEmail = reg.test(email);


        if (!name || !email || !departmentId || !Array.isArray(enrolledCourses)) {
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
        const response = await StudentService.createStudent(req.body);
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

const updateStudent = async(req, res) => {
    try {
        const StudentId = req.params.id
        const data = req.body
        if (!StudentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The StudentId is required'
            })
        }
        const response = await StudentService.updateStudent(StudentId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteStudent = async(req, res) => {
    try {
        const StudentId = req.params.id
        // const token = req.headers
        if (!StudentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The StudentId is required'
            })
        }
        const response = await StudentService.deleteStudent(StudentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllStudent = async(req, res) => {
    try {
        const response = await StudentService.getAllStudent()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationStudent = async (req, res) => {
    const {limit, page, filter} = req.query
    try {
        const response = await StudentService.getPaginationStudent(Number(limit), Number(page), filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsStudent = async (req, res) => {
    try {
        const StudentId = req.params.id
        // const token = req.headers
        if (!StudentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The StudentId is required'
            })
        }
        const response = await StudentService.getDetailsStudent(StudentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateAttendance = async(req, res) => {
    try {
        const StudentId = req.params.id
        const attendance = req.body;
        if (!StudentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The StudentId is required'
            })
        }
        const response = await StudentService.updateAttendance(StudentId, attendance)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

// const studentSchedule = async (req, res) => {
//     try {
//         const studentId = req.params.id; // Ensure this matches your route parameter naming
//         const termId = req.query.termId; // Assuming termId is passed as a query parameter

//         // Validate required inputs
//         if (!studentId) {
//             return res.status(400).json({
//                 status: 'ERR',
//                 message: 'The studentId is required.'
//             });
//         }
        
//         if (!termId) {
//             return res.status(400).json({
//                 status: 'ERR',
//                 message: 'The termId is required.'
//             });
//         }

//         // Assuming generateStudentSchedule now also takes termId as a parameter
//         const schedule = await StudentService.studentSchedule(studentId, termId);
        
//         if (!schedule || schedule.length === 0) {
//             return res.status(404).json({
//                 status: 'ERR',
//                 message: 'Schedule not found.'
//             });
//         }

//         // Successful response with the schedule
//         return res.status(200).json({
//             status: 'OK',
//             data: schedule
//         });
//     } catch (e) {
//         console.error('Error fetching schedule:', e);
//         return res.status(500).json({
//             status: 'ERR',
//             message: 'An error occurred while fetching the schedule.',
//             error: e.toString()
//         });
//     }
// }

const studentSchedule = async (req, res) => {
    try {
        const studentId = req.params.id; // Ensure this matches your route parameter naming

        // Validate required input
        if (!studentId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The studentId is required.'
            });
        }

        const schedule = await StudentService.studentSchedule(studentId);
        
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


const studentUpdatePoint = async (req, res) => {
    try {
        const studentId = req.params.id; // Ensure this matches your route parameter naming

        // Validate required input
        if (!studentId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The studentId is required.'
            });
        }

        const updatePoint = await StudentService.studentUpdatePoint(studentId);
        
        if (updatePoint == null) {
            return res.status(404).json({
                status: 'ERR',
                message: 'updatePoint not found.'
            });
        }

        // Successful response with the schedule
        return res.status(200).json({
            status: 'OK',
            data: {updatePoint}
        });
    } catch (e) {
        console.error('Error fetching updatePoint:', e);
        return res.status(500).json({
            status: 'ERR',
            message: 'An error occurred while fetching the updatePoint.',
            error: e.toString()
        });
    }
}


module.exports = {
    createStudent,
    updateStudent,
    deleteStudent,
    getAllStudent,
    getDetailsStudent,
    updateAttendance,
    studentSchedule,
    getPaginationStudent,
    studentUpdatePoint
}
const CourseService = require('../services/CourseService')

const createCourse = async(req, res) => {
    try {
        const { title, description, departmentId, credits, instructors, termsOffered, totalSlots } = req.body;
        

        if (!title || !description || !departmentId || !credits || !Array.isArray(instructors) || !Array.isArray(termsOffered) || !totalSlots) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }
        const response = await CourseService.createCourse(req.body);
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

const updateCourse = async(req, res) => {
    try {
        const CourseId = req.params.id
        const data = req.body
        if (!CourseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The CourseId is required'
            })
        }
        const response = await CourseService.updateCourse(CourseId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteCourse = async(req, res) => {
    try {
        const CourseId = req.params.id
        // const token = req.headers
        if (!CourseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The CourseId is required'
            })
        }
        const response = await CourseService.deleteCourse(CourseId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllCourse = async(req, res) => {
    try {
        const response = await CourseService.getAllCourse()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationCourse = async (req, res) => {
    const { limit, page, filter } = req.query;
    try {
        const response = await CourseService.getPaginationCourse(Number(limit), Number(page), filter);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Pagination Error:', error);
        return res.status(500).json({
            message: 'Error fetching paginated course',
            error: error.message
        });
    }
}


const getDetailsCourse = async (req, res) => {
    try {
        const CourseId = req.params.id
        // const token = req.headers
        if (!CourseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The CourseId is required'
            })
        }
        const response = await CourseService.getDetailsCourse(CourseId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourse,
    getDetailsCourse,
    getPaginationCourse
}
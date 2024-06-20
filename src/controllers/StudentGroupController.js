const StudentGroupService = require('../services/StudentGroupService')

const createStudentGroup = async(req, res) => {
    try {
        const { name, courseId, termId, members } = req.body;
        

        if (!name || !courseId || !termId  || !Array.isArray(members)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }
        const response = await StudentGroupService.createStudentGroup(req.body);
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

const updateStudentGroup = async(req, res) => {
    try {
        const StudentGroupId = req.params.id
        const data = req.body
        if (!StudentGroupId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The StudentGroupId is required'
            })
        }
        const response = await StudentGroupService.updateStudentGroup(StudentGroupId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteStudentGroup = async(req, res) => {
    try {
        const StudentGroupId = req.params.id
        // const token = req.headers
        if (!StudentGroupId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The StudentGroupId is required'
            })
        }
        const response = await StudentGroupService.deleteStudentGroup(StudentGroupId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllStudentGroup = async(req, res) => {
    try {
        const response = await StudentGroupService.getAllStudentGroup()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationStudentGroup = async(req, res) => {
    try {
        const {limit, page, filter} = req.query
        const response = await StudentGroupService.getPaginationStudentGroup(Number(limit), Number(page), filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsStudentGroup = async (req, res) => {
    try {
        const StudentGroupId = req.params.id
        // const token = req.headers
        if (!StudentGroupId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The StudentGroupId is required'
            })
        }
        const response = await StudentGroupService.getDetailsStudentGroup(StudentGroupId)
        return res.status(200).json(response)
    } catch (e) {
        console.log("control",e)
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createStudentGroup,
    updateStudentGroup,
    deleteStudentGroup,
    getAllStudentGroup,
    getDetailsStudentGroup,
    getPaginationStudentGroup
}
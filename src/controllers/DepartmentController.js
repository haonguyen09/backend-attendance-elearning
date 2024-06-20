const DepartmentService = require('../services/DepartmentService')

const createDepartment = async(req, res) => {
    try {
        const { name } = req.body;
        

        if (!name) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }
        const response = await DepartmentService.createDepartment(req.body);
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

const updateDepartment = async(req, res) => {
    try {
        const DepartmentId = req.params.id
        const data = req.body
        if (!DepartmentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The DepartmentId is required'
            })
        }
        const response = await DepartmentService.updateDepartment(DepartmentId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteDepartment = async(req, res) => {
    try {
        const DepartmentId = req.params.id
        // const token = req.headers
        if (!DepartmentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The DepartmentId is required'
            })
        }
        const response = await DepartmentService.deleteDepartment(DepartmentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllDepartment = async(req, res) => {
    try {
        const response = await DepartmentService.getAllDepartment()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationDepartment = async (req, res) => {
    const { limit, page, filter } = req.query;
    try {
        const response = await DepartmentService.getPaginationDepartment(Number(limit), Number(page), filter);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Pagination Error:', error);
        return res.status(500).json({
            message: 'Error fetching paginated department',
            error: error.message
        });
    }
}


const getDetailsDepartment = async (req, res) => {
    try {
        const DepartmentId = req.params.id
        // const token = req.headers
        if (!DepartmentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The DepartmentId is required'
            })
        }
        const response = await DepartmentService.getDetailsDepartment(DepartmentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartment,
    getDetailsDepartment,
    getPaginationDepartment
}
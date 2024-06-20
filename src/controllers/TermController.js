const TermService = require('../services/TermService')

const createTerm = async(req, res) => {
    try {
        const { name, startDate, endDate } = req.body;
        


        if (!name || !startDate || !endDate) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate date logic
        if (start >= end) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Dates must be logically ordered: startDate < endDate'
            });
        }

        const response = await TermService.createTerm(req.body);
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

const updateTerm = async(req, res) => {
    try {
        const TermId = req.params.id
        const data = req.body
        if (!TermId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The TermId is required'
            })
        }

         // Destructuring dates from the body to validate
        const {name, startDate, endDate } = data;

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate date logic
        if (start >= end) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Dates must be logically ordered: startDate < endDate'
            });
        }

        const response = await TermService.updateTerm(TermId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteTerm = async(req, res) => {
    try {
        const TermId = req.params.id
        // const token = req.headers
        if (!TermId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The TermId is required'
            })
        }
        const response = await TermService.deleteTerm(TermId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllTerm = async(req, res) => {
    try {
        const response = await TermService.getAllTerm()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationTerm = async (req, res) => {
    const { limit, page, filter } = req.query;
    try {
        const response = await TermService.getPaginationTerm(Number(limit), Number(page), filter);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Pagination Error:', error);
        return res.status(500).json({
            message: 'Error fetching paginated terms',
            error: error.message
        });
    }
}


const getDetailsTerm = async (req, res) => {
    try {
        const TermId = req.params.id
        // const token = req.headers
        if (!TermId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The TermId is required'
            })
        }
        const response = await TermService.getDetailsTerm(TermId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createTerm,
    updateTerm,
    deleteTerm,
    getAllTerm,
    getDetailsTerm,
    getPaginationTerm
}
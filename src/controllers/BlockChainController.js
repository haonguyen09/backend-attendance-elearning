const BlockChainService = require('../services/BlockChainService')

const createBlockChain = async(req, res) => {
    try {
        const { PP, addressWallet, LDTs, studentId } = req.body;
        

        if (!studentId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }
        const response = await BlockChainService.createBlockChain(req.body);
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

const updateBlockChain = async(req, res) => {
    try {
        const BlockChainId = req.params.id
        const data = req.body
        if (!BlockChainId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The BlockChainId is required'
            })
        }
        const response = await BlockChainService.updateBlockChain(BlockChainId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log('control', e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteBlockChain = async(req, res) => {
    try {
        const BlockChainId = req.params.id
        // const token = req.headers
        if (!BlockChainId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The BlockChainId is required'
            })
        }
        const response = await BlockChainService.deleteBlockChain(BlockChainId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllBlockChain = async(req, res) => {
    try {
        const response = await BlockChainService.getAllBlockChain()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsBlockChain = async (req, res) => {
    try {
        const BlockChainId = req.params.id
        // const token = req.headers
        if (!BlockChainId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The BlockChainId is required'
            })
        }
        const response = await BlockChainService.getDetailsBlockChain(BlockChainId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createBlockChain,
    updateBlockChain,
    deleteBlockChain,
    getAllBlockChain,
    getDetailsBlockChain
}
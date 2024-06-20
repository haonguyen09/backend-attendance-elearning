const express = require("express");
const router = express.Router();
const blockChainController = require('../controllers/BlockChainController');
const { authMiddleWare } = require("../middleware/authMiddleware");


router.post('/create',  blockChainController.createBlockChain)
router.put('/update/:id',  blockChainController.updateBlockChain)
router.delete('/delete/:id',  blockChainController.deleteBlockChain)
router.get('/get-all', blockChainController.getAllBlockChain)
router.get('/get-details/:id', blockChainController.getDetailsBlockChain)


module.exports = router
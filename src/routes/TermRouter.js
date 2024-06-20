const express = require("express");
const router = express.Router();
const termController = require('../controllers/TermController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authMiddleWare ,  termController.createTerm)
router.put('/update/:id', authMiddleWare ,  termController.updateTerm)
router.delete('/delete/:id' ,  termController.deleteTerm)
router.get('/get-all', termController.getAllTerm)
router.get('/get-pagination', termController.getPaginationTerm)
router.get('/get-details/:id', termController.getDetailsTerm)


module.exports = router
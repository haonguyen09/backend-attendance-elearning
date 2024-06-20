const express = require("express");
const router = express.Router();
const slotController = require('../controllers/SlotController');
const { authMiddleWare } = require("../middleware/authMiddleware");


router.post('/create', authMiddleWare ,  slotController.createSlot)
router.put('/update/:id', authMiddleWare , slotController.updateSlot)
router.delete('/delete/:id' ,  slotController.deleteSlot)
router.get('/get-all', slotController.getAllSlot)
router.get('/get-pagination', slotController.getPaginationSlot)
router.get('/get-details/:id', slotController.getDetailsSlot)


module.exports = router
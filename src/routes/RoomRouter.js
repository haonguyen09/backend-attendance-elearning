const express = require("express");
const router = express.Router();
const roomController = require('../controllers/RoomController');
const { authMiddleWare } = require("../middleware/authMiddleware");


router.post('/create', roomController.createRoom)
router.put('/update/:id' , roomController.updateRoom)
router.delete('/delete/:id' , roomController.deleteRoom)
router.get('/get-all', roomController.getAllRoom)
router.get('/get-pagination', roomController.getPaginationRoom)
router.get('/get-details/:id', roomController.getDetailsRoom)


module.exports = router
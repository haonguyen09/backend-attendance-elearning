const express = require("express");
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');
const { authMiddleWare } = require("../middleware/authMiddleware");


router.post('/create', attendanceController.createAttendance)
router.put('/update/:id', attendanceController.updateAttendance)
router.delete('/delete/:id', attendanceController.deleteAttendance)
router.get('/get-all', attendanceController.getAllAttendance)
router.get('/get-details/:id', attendanceController.getDetailsAttendance)
router.get('/get-pagination', attendanceController.getPaginationAttendance)
router.patch('/attendanceStatuses', authMiddleWare, attendanceController.updateMultipleAttendanceRecords)


module.exports = router
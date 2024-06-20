const express = require("express");
const router = express.Router();
const studentController = require('../controllers/StudentController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create',  authMiddleWare ,studentController.createStudent)
router.put('/update/:id' , studentController.updateStudent)
router.delete('/delete/:id' , studentController.deleteStudent)
router.get('/get-all', studentController.getAllStudent)
router.get('/get-pagination', studentController.getPaginationStudent)
router.get('/get-details/:id', studentController.getDetailsStudent)
router.put('/attendance/:id', authMiddleWare, studentController.updateAttendance)
router.get('/timetable/:id', studentController.studentSchedule)
router.get('/update-point/:id', studentController.studentUpdatePoint)



module.exports = router
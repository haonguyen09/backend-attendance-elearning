const express = require("express");
const router = express.Router();
const instructorController = require('../controllers/InstructorController');
const { authMiddleWare } = require("../middleware/authMiddleware");


router.post('/create', authMiddleWare , instructorController.createInstructor)
router.put('/update/:id', authMiddleWare , instructorController.updateInstructor)
router.delete('/delete/:id' , instructorController.deleteInstructor)
router.get('/get-all' ,instructorController.getAllInstructor)
router.get('/get-details/:id', instructorController.getDetailsInstructor)
router.get('/get-pagination', instructorController.getPaginationInstructor)
router.get('/timetable/:id', instructorController.instructorSchedule)

module.exports = router
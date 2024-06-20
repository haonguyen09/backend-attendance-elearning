const express = require("express");
const router = express.Router();
const courseController = require('../controllers/CourseController');
const { authMiddleWare } = require("../middleware/authMiddleware");


router.post('/create', authMiddleWare,  courseController.createCourse)
router.put('/update/:id', authMiddleWare,  courseController.updateCourse)
router.delete('/delete/:id',  courseController.deleteCourse)
router.get('/get-all', courseController.getAllCourse)
router.get('/get-details/:id', courseController.getDetailsCourse)
router.get('/get-pagination', courseController.getPaginationCourse)



module.exports = router
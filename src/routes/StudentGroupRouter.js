const express = require("express");
const router = express.Router();
const StudentGroupController = require('../controllers/StudentGroupController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create',  authMiddleWare ,  StudentGroupController.createStudentGroup)
router.put('/update/:id',  authMiddleWare ,  StudentGroupController.updateStudentGroup)
router.delete('/delete/:id' ,  StudentGroupController.deleteStudentGroup)
router.get('/get-all', StudentGroupController.getAllStudentGroup)
router.get('/get-pagination', StudentGroupController.getPaginationStudentGroup)
router.get('/get-details/:id', StudentGroupController.getDetailsStudentGroup)


module.exports = router
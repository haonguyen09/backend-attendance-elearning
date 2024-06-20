const express = require("express");
const router = express.Router();
const departmentController = require('../controllers/DepartmentController');
const { authMiddleWare } = require("../middleware/authMiddleware");


router.post('/create', authMiddleWare, departmentController.createDepartment)
router.put('/update/:id', authMiddleWare,  departmentController.updateDepartment)
router.delete('/delete/:id',  departmentController.deleteDepartment)
router.get('/get-all', departmentController.getAllDepartment)
router.get('/get-details/:id', departmentController.getDetailsDepartment)
router.get('/get-pagination', departmentController.getPaginationDepartment)


module.exports = router
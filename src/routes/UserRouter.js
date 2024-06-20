const express = require("express");
const router = express.Router();
const userController = require('../controllers/UserController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authMiddleWare , userController.createUser)
router.post('/login', userController.loginUser)
router.post('/logout', userController.logoutUser)
router.put('/update/:id', authMiddleWare ,userController.updateUser)
router.get('/get-details/:id', authMiddleWare, userController.getDetailsUser)
router.get('/get-all', userController.getAllUser)
router.get('/get-pagination', userController.getPaginationUser)
router.delete('/delete/:id', userController.deleteUser)
router.post('/refresh-token', userController.refreshToken)


module.exports = router
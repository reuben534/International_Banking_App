const express = require('express');
const router = express.Router();
const { createEmployee } = require('../controllers/employeeController');
const { validateEmployee } = require('../utils/validation/employeeValidation');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, validateEmployee, createEmployee);

module.exports = router;

const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const employeeExists = await Employee.findOne({ email });

    if (employeeExists) {
        res.status(400);
        throw new Error('Employee already exists');
    }

    const employee = await Employee.create({
        name,
        email,
        password,
    });

    if (employee) {
        res.status(201).json({
            _id: employee._id,
            name: employee.name,
            email: employee.email,
            isAdmin: employee.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid employee data');
    }
});

module.exports = { createEmployee };

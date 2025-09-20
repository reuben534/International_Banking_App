const { check } = require('express-validator');

const nameValidation = check('name', 'Name must be alphabetic').matches(/^[a-zA-Z ]+$/);
const idNumberValidation = check('idNumber', 'ID Number must be 13 digits').matches(/^\d{13}$/);
const accountNumberValidation = check('accountNumber', 'Account Number must be 10 digits').matches(/^\d{10}$/);
const passwordValidation = check('password', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
const roleValidation = check('role', 'Role must be either customer or employee').matches(/^(customer|employee)$/);

const registerUserValidation = [
    nameValidation,
    idNumberValidation,
    accountNumberValidation,
    passwordValidation,
    roleValidation,
];

const authUserValidation = [
    idNumberValidation,
    accountNumberValidation,
    check('password', 'Password is required').not().isEmpty(),
];

module.exports = {
    registerUserValidation,
    authUserValidation,
};
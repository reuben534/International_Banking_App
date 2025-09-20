const { check } = require('express-validator');

const amountValidation = check('amount', 'Amount must be a valid decimal number').matches(/^\d+(\.\d{1,2})?$/);
const currencyValidation = check('currency', 'Currency must be a 3-letter uppercase code').matches(/^[A-Z]{3}$/);
const providerValidation = check('provider', 'Provider must be SWIFT').matches(/^SWIFT$/);
const payeeAccountValidation = check('payeeAccount', 'Payee account must be alphanumeric and at least 5 characters').matches(/^[a-zA-Z0-9]{5,}$/);
const swiftCodeValidation = check('swiftCode', 'SWIFT code must be a valid BIC code').isBIC();


const createPaymentValidation = [
    amountValidation,
    currencyValidation,
    providerValidation,
    payeeAccountValidation,
    swiftCodeValidation,
];

module.exports = {
    createPaymentValidation,
};
const validator = require('validator');
const createClassValidator = (body) => {
    const missingFields = [];

    if (!body) {
        missingFields.push("body");
        return missingFields;
    }

    if (!body.teacher || !validator.isEmail(body.teacher)) {
        missingFields.push("teacher should be a valid email");
    }

    if (!body.students || !body.students.length || !body.students.every(email => validator.isEmail(email))) {
        missingFields.push("students should be a non-empty array of valid emails");
    }

    // if (!body.startTime || !isValidFutureDate(body.startTime)) {
    //     missingFields.push("startTime should be a valid date and greater than the current date");
    // }

    return missingFields;
};
// function isValidFutureDate(dateString) {
//     const inputDate = new Date(dateString);
//     const currentDate = new Date();
//     console.log(inputDate, currentDate);
//     return !isNaN(inputDate.getTime()) && inputDate > currentDate;
// }
module.exports = {
    createClassValidator
};

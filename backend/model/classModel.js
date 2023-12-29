const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    teacher: String,
    students: [String],
    startTime: Date,
    meetingJoinUrl: String,
    meetingStartUrl: String,
    createdAt: Date,
  });

  const Class = mongoose.model('Class', classSchema);

  module.exports = Class;


  
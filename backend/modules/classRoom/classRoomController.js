const logger = require("../../config/winston");
const {createClassValidator} = require("../../validator/classRoomValidator")
const {scheduleAMeeting} = require("../../helper/zoomHelper");
const Class = require("../../model/classModel");
const nodemailer = require("nodemailer");


const createClass = async (req, res) => {
    try {
        logger.info("Incoming Request For Create ClassRoom", {requestBody: req.body});
        const body = req.body;
        const validate = createClassValidator(body);
        if( validate && validate.length ){
            return res.status(400).send(`Following params are missing/sent wrongly in the request body: ${validate}`);
        }
        const currentDataTime = new Date();

        const bodyForZoom = {
            teacher: req.body.teacher,
            students: req.body.students,
            startTime: req.body.startTime+':00'
        };
        const emailList = [req.body.teacher,...req.body.students];
        const scheduledMeetingDetails = await scheduleAMeeting(bodyForZoom);
        //const scheduledMeetingDetails = await scheduleAMeeting(body);
        await Class.collection.insertOne({
            ...body,
            createdAt: currentDataTime,
            meetingJoinUrl: scheduledMeetingDetails.join_url,
            meetingStartUrl: scheduledMeetingDetails.start_url
        });
        const meetJoinUrl = scheduledMeetingDetails.join_url;

        await sendMail(emailList,meetJoinUrl);

        return res.status(201).send({
            timestamp: currentDataTime,
            message: "Meeting created successfully!",
            invitees: req.body.students
        });
    } catch (exception) {
        return res.status(500).send({
            message:"Exception occured",
            error: exception
        });
    }
}

const sendMail = async (emailList, meetJoinUrl) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_PASSWORD
        }
      });
      
      var mailOptions = {
        from: 'Gunveer" <g2516477@gmail.com>',
        to: emailList,
        subject: 'Scheduled Class Zoom Link',
        text: `Link to join the scheduled class ${meetJoinUrl}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}


module.exports = {
    createClass
}
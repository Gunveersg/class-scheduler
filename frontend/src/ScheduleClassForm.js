import React, { useState } from "react";
import "./scheduleClassForm.css";
import axios from "axios";

const ScheduleClassForm = () => {
  const [teacherEmail, setTeacherEmail] = useState("");
  const [studentEmails, setStudentEmails] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const validateTime = (time) => {
    const selectedTime = new Date(time).getTime();
    const currentTime = new Date().getTime();
    return selectedTime > currentTime;
  };

  const handleScheduleClass = async () => {
    setError("");
    try {
      if (!validateEmail(teacherEmail)) {
        setError("Please enter a valid teacher email.");
        return;
      }

      const studentEmailArray = studentEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "");

      if (studentEmailArray.length === 0) {
        setError(`No students added`);
        return;
      }

      for (let email of studentEmailArray) {
        if (!validateEmail(email)) {
          setError(`Invalid email format for student: ${email}`);
          return;
        }
      }

      if (!validateTime(meetingTime)) {
        setError("Please select a future time for the meeting.");
        return;
      }
      //setMeetingTime(utcMeetingTime);
      const requestBody = {
        teacher: teacherEmail,
        students: studentEmailArray,
        startTime: meetingTime,
      };

      const response = await axios.post(
        "http://localhost:8080/api/classRoom/class",
        requestBody
      );

      console.log(response);
      setSuccess("Class scheduled successfully!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
      console.log("Class scheduled successfully!");
    } catch (error) {
      setError("Please select a future time for the meeting.");
      setTimeout(() => {
        setError("");
      }, 3000);
      console.error("Error scheduling class:", error);
    }
  };

  return (
    <div className="scheduleForm">
      <h2>Schedule Class</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div>
        <label>
          Teacher's Email:
          <input
            className="inputField"
            type="email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Students' Emails (comma-separated):
          <input
            className="inputField"
            type="text"
            value={studentEmails}
            onChange={(e) => setStudentEmails(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Meeting Time:
          <input
            className="inputField"
            type="datetime-local"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
          />
        </label>
      </div>
      <button className="submitButton" onClick={handleScheduleClass}>
        Schedule Class
      </button>
    </div>
  );
};

export default ScheduleClassForm;

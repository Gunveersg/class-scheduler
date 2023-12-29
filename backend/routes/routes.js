const express = require("express");

const classRoomRoutes = require("../modules/classRoom/classRoomRoutes");

const apiRouter = express.Router();

module.exports = () => apiRouter.use("/classRoom", classRoomRoutes());

const express = require("express");
const cors = require("cors");

const routes = require("../routes/routes");

module.exports = () => {
  const app = express();
  const allowedOrigins = ["http://localhost:3000"];
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );
  app.use(express.json());
  app.use("/api", routes());
  return app;
};

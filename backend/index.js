const mongoose = require("mongoose");
const databaseConfig = require("./config/databaseConfig");
const logger = require("./config/winston");

mongoose.Promise = global.Promise;

mongoose.connect(databaseConfig.databaseConnectionString);

const db = mongoose.connection;
const PORT = process.env.PORT;

db.on("error", err => {
	logger.error("Mongoose error", err);
});

db.once('open', async () => {
    const setupExpress = require('./config/express');
    const app = setupExpress();

    app.listen(PORT, ()=>{
        logger.info(`Server Started on PORT: ${PORT}`);
    })
})
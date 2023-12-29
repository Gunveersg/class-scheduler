const winston = require('winston');


const logger = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: process.stderr,
      level: 'debug',
    })
  ],
  exitOnError: true, 
});

logger.stream = {
  write: function(message, encoding) {
    console.log(message);
  },
};

module.exports = logger;
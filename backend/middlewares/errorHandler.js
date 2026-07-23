const logger = require('./logger');

module.exports = (err, req, res, next) => {
  logger.error(`${err.message} | ${req.method} ${req.originalUrl}`);

    // Knex / PostgreSQL errors
      if (err.code === '23505') {
          return res.status(409).json({
                success: false,
                      message: 'A record with this information already exists.',
                          });
                            }

                              if (err.code === '23503') {
                                  return res.status(400).json({
                                        success: false,
                                              message: 'Related record not found.',
                                                  });
                                                    }

                                                      const status  = err.statusCode || err.status || 500;
                                                        const message = err.message    || 'Internal Server Error';

                                                          res.status(status).json({
                                                              success: false,
                                                                  message,
                                                                      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
                                                                        });
                                                                        };
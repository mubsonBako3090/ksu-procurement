const jwt            = require('jsonwebtoken');
const { sendError }  = require('../utils/apiResponse');

module.exports = (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;

          if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return sendError(res, 401, 'Access denied. No token provided.');
                    }

                        const token   = authHeader.split(' ')[1];
                            const decoded = jwt.verify(token, process.env.JWT_SECRET);

                                req.user = decoded;
                                    next();

                                      } catch (err) {
                                          if (err.name === 'TokenExpiredError') {
                                                return sendError(res, 401, 'Token expired. Please login again.');
                                                    }
                                                        return sendError(res, 401, 'Invalid token.');
                                                          }
                                                          };
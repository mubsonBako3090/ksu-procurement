const { sendError } = require('../utils/apiResponse');

const role = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
      return sendError(res, 401, 'Unauthorized. Please login.');
        }

          if (!allowedRoles.includes(req.user.role)) {
              return sendError(
                    res, 403,
                          `Access denied. This action requires: ${allowedRoles.join(' or ')} role.`
                              );
                                }

                                  next();
                                  };

                                  module.exports = role;
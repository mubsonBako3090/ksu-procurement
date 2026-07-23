const { sendError } = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
      abortEarly:   false,
          stripUnknown: true,
            });

              if (error) {
                  const messages = error.details.map(d => d.message.replace(/['"]/g, ''));
                      return sendError(res, 422, 'Validation failed', messages);
                        }

                          next();
                          };

                          module.exports = validate;
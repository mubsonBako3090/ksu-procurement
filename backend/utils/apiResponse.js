exports.sendSuccess = (res, statusCode, message, data = null) => {
      const response = { success: true, message };
        if (data !== null) response.data = data;
          return res.status(statusCode).json(response);
          };

          exports.sendError = (res, statusCode, message, errors = null) => {
            const response = { success: false, message };
              if (errors) response.errors = errors;
                return res.status(statusCode).json(response);
                };
}
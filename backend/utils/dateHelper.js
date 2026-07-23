exports.currentFiscalYear = () => new Date().getFullYear();

exports.formatDate = (date) => {
  if (!date) return null;
    return new Date(date).toLocaleDateString('en-NG', {
        day:   '2-digit',
            month: 'long',
                year:  'numeric',
                  });
                  };

                  exports.formatDateTime = (date) => {
                    if (!date) return null;
                      return new Date(date).toLocaleString('en-NG');
                      };

                      exports.isExpired = (date) => new Date(date) < new Date();

                      exports.addDays = (date, days) => {
                        const result = new Date(date);
                          result.setDate(result.getDate() + days);
                            return result;
                            };
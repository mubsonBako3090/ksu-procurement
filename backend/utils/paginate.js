exports.paginate = (data, page = 1, limit = 20) => {
      const p     = parseInt(page)  || 1;
        const l     = parseInt(limit) || 20;
          const start = (p - 1) * l;
            const end   = start + l;
              const items = Array.isArray(data) ? data.slice(start, end) : data;

                return {
                    data: items,
                        pagination: {
                              total:       Array.isArray(data) ? data.length : 0,
                                    page:        p,
                                          limit:       l,
                                                totalPages:  Math.ceil((Array.isArray(data) ? data.length : 0) / l),
                                                      hasNextPage: end < (Array.isArray(data) ? data.length : 0),
                                                            hasPrevPage: p > 1,
                                                                },
                                                                  };
                                                                  };
}
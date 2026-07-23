exports.formatNaira = (amount) => {
      return new Intl.NumberFormat('en-NG', {
          style:    'currency',
              currency: 'NGN',
                }).format(amount || 0);
                };

                exports.formatNumber = (num) => {
                  return Number(num || 0).toLocaleString('en-NG');
                  };
}
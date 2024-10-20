const helmet = require('helmet');

const helmetConfig = () => {
  return helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
      ],
      styleSrc: [
        "'self'",
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
      ]
    }
  });
};

module.exports = helmetConfig;

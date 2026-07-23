const knex    = require('knex');
const config  = require('../database/knexfile');
const logger  = require('../middlewares/logger');

const env = process.env.NODE_ENV || 'development';
const db  = knex(config[env]);

db.raw('SELECT 1')
  .then(() => logger.info('✅ PostgreSQL database connected'))
    .catch(err => {
        logger.error(`❌ Database connection failed: ${err.message}`);
            process.exit(1);
              });

              module.exports = db;
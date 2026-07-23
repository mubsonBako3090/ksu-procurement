require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

module.exports = {
  development: {
      client: 'postgresql',
          connection: {
                host:     process.env.DB_HOST     || 'localhost',
                      port:     process.env.DB_PORT     || 5432,
                            database: process.env.DB_NAME     || 'ksu_procurement',
                                  user:     process.env.DB_USER     || 'postgres',
                                        password: process.env.DB_PASSWORD || '',
                                            },
                                                pool: { min: 2, max: 10 },
                                                    migrations: {
                                                          tableName: 'knex_migrations',
                                                                directory: './migrations',
                                                                    },
                                                                        seeds: { directory: './seeds' },
                                                                          },

                                                                            production: {
                                                                                client: 'postgresql',
                                                                                    connection: {
                                                                                          connectionString: process.env.DATABASE_URL,
                                                                                                ssl: { rejectUnauthorized: false },
                                                                                                    },
                                                                                                        pool: { min: 2, max: 10 },
                                                                                                            migrations: {
                                                                                                                  tableName: 'knex_migrations',
                                                                                                                        directory: './migrations',
                                                                                                                            },
                                                                                                                                seeds: { directory: './seeds' },
                                                                                                                                  },
                                                                                                                                  };
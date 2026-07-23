exports.up = (knex) =>
      knex.schema.createTable('users', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.string('name').notNullable();
                  t.string('email').unique().notNullable();
                      t.string('password').notNullable();
                          t.string('phone');
                              t.string('staff_id').unique();
                                  t.enum('role', [
                                        'requester',
                                              'hod',
                                                    'procurement',
                                                          'finance',
                                                                'vc',
                                                                      'admin',
                                                                          ]).defaultTo('requester');
                                                                              t.uuid('dept_id')
                                                                                    .references('id')
                                                                                          .inTable('departments')
                                                                                                .onDelete('SET NULL')
                                                                                                      .nullable();
                                                                                                          t.boolean('is_active').defaultTo(true);
                                                                                                              t.string('avatar');
                                                                                                                  t.string('reset_token');
                                                                                                                      t.timestamp('reset_token_expires');
                                                                                                                          t.timestamp('last_login');
                                                                                                                              t.timestamps(true, true);
                                                                                                                                });

                                                                                                                                exports.down = (knex) => knex.schema.dropTableIfExists('users');
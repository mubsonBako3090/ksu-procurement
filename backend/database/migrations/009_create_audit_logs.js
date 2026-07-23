exports.up = (knex) =>
      knex.schema.createTable('audit_logs', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.uuid('req_id')
                    .references('id')
                          .inTable('requisitions')
                                .onDelete('CASCADE')
                                      .nullable();
                                          t.uuid('user_id').references('id').inTable('users');
                                              t.string('action').notNullable();
                                                  t.text('details');
                                                      t.string('ip_address');
                                                          t.string('user_agent');
                                                              t.timestamps(true, true);
                                                                });

                                                                exports.down = (knex) => knex.schema.dropTableIfExists('audit_logs');
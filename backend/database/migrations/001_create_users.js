exports.up = (knex) =>
      knex.schema.createTable('departments', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.string('name').notNullable().unique();
                  t.string('code').unique();
                      t.string('hod_name');
                          t.string('phone');
                              t.string('email');
                                  t.boolean('is_active').defaultTo(true);
                                      t.timestamps(true, true);
                                        });

                                        exports.down = (knex) => knex.schema.dropTableIfExists('departments');
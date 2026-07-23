exports.up = (knex) =>
      knex.schema.createTable('vendors', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.string('name').notNullable();
                  t.string('email');
                      t.string('phone');
                          t.text('address');
                              t.string('location');
                                  t.string('rc_number');
                                      t.string('tin_number');
                                          t.boolean('is_verified').defaultTo(false);
                                              t.decimal('rating', 3, 1).defaultTo(0);
                                                  t.text('notes');
                                                      t.boolean('is_active').defaultTo(true);
                                                          t.timestamps(true, true);
                                                            });

                                                            exports.down = (knex) => knex.schema.dropTableIfExists('vendors');
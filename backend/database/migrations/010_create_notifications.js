exports.up = (knex) =>
      knex.schema.createTable('notifications', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.uuid('user_id')
                    .references('id')
                          .inTable('users')
                                .onDelete('CASCADE');
                                    t.string('title').notNullable();
                                        t.text('message');
                                            t.enum('type', ['info', 'success', 'warning', 'error']).defaultTo('info');
                                                t.boolean('is_read').defaultTo(false);
                                                    t.uuid('req_id').nullable();
                                                        t.string('action_url');
                                                            t.timestamps(true, true);
                                                              });

                                                              exports.down = (knex) =>
                                                                knex.schema.dropTableIfExists('notifications');
exports.up = (knex) =>
      knex.schema.createTable('approvals', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.uuid('req_id')
                    .references('id')
                          .inTable('requisitions')
                                .onDelete('CASCADE');
                                    t.uuid('approver_id').references('id').inTable('users');
                                        t.integer('level').notNullable();
                                            t.enum('role', ['hod', 'procurement', 'finance', 'vc']);
                                                t.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending');
                                                    t.text('comment');
                                                        t.timestamp('decided_at');
                                                            t.timestamps(true, true);
                                                              });

                                                              exports.down = (knex) => knex.schema.dropTableIfExists('approvals');
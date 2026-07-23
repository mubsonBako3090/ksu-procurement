exports.up = (knex) =>
      knex.schema.createTable('requisition_items', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.uuid('req_id')
                    .references('id')
                          .inTable('requisitions')
                                .onDelete('CASCADE');
                                    t.string('description').notNullable();
                                        t.integer('quantity').notNullable().defaultTo(1);
                                            t.string('unit').defaultTo('units');
                                                t.decimal('unit_price', 15, 2).notNullable();
                                                    t.decimal('total_price', 15, 2);
                                                        t.string('specification');
                                                            t.timestamps(true, true);
                                                              });

                                                              exports.down = (knex) =>
                                                                knex.schema.dropTableIfExists('requisition_items');
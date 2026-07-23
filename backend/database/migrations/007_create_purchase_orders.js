exports.up = (knex) =>
      knex.schema.createTable('purchase_orders', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.string('lpo_number').unique().notNullable();
                  t.uuid('req_id').references('id').inTable('requisitions');
                      t.uuid('vendor_id').references('id').inTable('vendors');
                          t.uuid('issued_by').references('id').inTable('users');
                              t.enum('status', [
                                    'issued',
                                          'acknowledged',
                                                'delivered',
                                                      'closed',
                                                          ]).defaultTo('issued');
                                                              t.date('expected_delivery_date');
                                                                  t.date('actual_delivery_date');
                                                                      t.text('delivery_notes');
                                                                          t.text('notes');
                                                                              t.timestamps(true, true);
                                                                                });

                                                                                exports.down = (knex) =>
                                                                                  knex.schema.dropTableIfExists('purchase_orders');
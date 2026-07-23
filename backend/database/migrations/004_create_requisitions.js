exports.up = (knex) =>
      knex.schema.createTable('requisitions', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.string('req_number').unique().notNullable();
                  t.string('title').notNullable();
                      t.text('justification');
                          t.uuid('requester_id').references('id').inTable('users').onDelete('CASCADE');
                              t.uuid('dept_id').references('id').inTable('departments').onDelete('CASCADE');
                                  t.string('category');
                                      t.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
                                          t.enum('status', [
                                                'draft',
                                                      'pending_hod',
                                                            'pending_procurement',
                                                                  'pending_finance',
                                                                        'pending_vc',
                                                                              'approved',
                                                                                    'rejected',
                                                                                        ]).defaultTo('draft');
                                                                                            t.decimal('total_amount', 15, 2).defaultTo(0);
                                                                                                t.uuid('vendor_id')
                                                                                                      .references('id')
                                                                                                            .inTable('vendors')
                                                                                                                  .onDelete('SET NULL')
                                                                                                                        .nullable();
                                                                                                                            t.boolean('lpo_generated').defaultTo(false);
                                                                                                                                t.date('required_date');
                                                                                                                                    t.text('rejection_reason');
                                                                                                                                        t.timestamps(true, true);
                                                                                                                                          });

                                                                                                                                          exports.down = (knex) => knex.schema.dropTableIfExists('requisitions');
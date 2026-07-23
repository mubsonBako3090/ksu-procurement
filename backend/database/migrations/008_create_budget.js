exports.up = (knex) =>
      knex.schema.createTable('budgets', (t) => {
          t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
              t.uuid('dept_id').references('id').inTable('departments');
                  t.integer('fiscal_year').notNullable();
                      t.decimal('amount_allocated', 15, 2).defaultTo(0);
                          t.decimal('amount_spent',     15, 2).defaultTo(0);
                              t.decimal('amount_committed', 15, 2).defaultTo(0);
                                  t.string('budget_code');
                                      t.text('notes');
                                          t.unique(['dept_id', 'fiscal_year']);
                                              t.timestamps(true, true);
                                                });

                                                exports.down = (knex) => knex.schema.dropTableIfExists('budgets');
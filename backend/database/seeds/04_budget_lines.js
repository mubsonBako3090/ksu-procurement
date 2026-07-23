exports.seed = async (knex) => {
      await knex('budgets').del();

        const depts = await knex('departments').select('id', 'code');
          const dept  = (code) => depts.find((d) => d.code === code)?.id;
            const year  = new Date().getFullYear();

              await knex('budgets').insert([
                  { dept_id: dept('ICT'), fiscal_year: year, amount_allocated: 8000000,  amount_spent: 4500000, amount_committed: 1200000 },
                      { dept_id: dept('ENG'), fiscal_year: year, amount_allocated: 12000000, amount_spent: 3200000, amount_committed: 2500000 },
                          { dept_id: dept('SCI'), fiscal_year: year, amount_allocated: 10000000, amount_spent: 1200000, amount_committed: 0       },
                              { dept_id: dept('LIB'), fiscal_year: year, amount_allocated: 5000000,  amount_spent: 0,       amount_committed: 500000  },
                                  { dept_id: dept('REG'), fiscal_year: year, amount_allocated: 4000000,  amount_spent: 850000,  amount_committed: 200000  },
                                      { dept_id: dept('WRK'), fiscal_year: year, amount_allocated: 15000000, amount_spent: 750000,  amount_committed: 5000000 },
                                          { dept_id: dept('MED'), fiscal_year: year, amount_allocated: 6000000,  amount_spent: 1100000, amount_committed: 800000  },
                                              { dept_id: dept('STA'), fiscal_year: year, amount_allocated: 3500000,  amount_spent: 400000,  amount_committed: 0       },
                                                  { dept_id: dept('BUR'), fiscal_year: year, amount_allocated: 2000000,  amount_spent: 200000,  amount_committed: 0       },
                                                    ]);
                                                    };
}
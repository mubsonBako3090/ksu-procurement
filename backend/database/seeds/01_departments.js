exports.seed = async (knex) => {
      await knex('departments').del();
        await knex('departments').insert([
            { name: 'ICT Department',           code: 'ICT', hod_name: 'Prof. Musa Garba'     },
                { name: 'Faculty of Engineering',   code: 'ENG', hod_name: 'Prof. Abubakar Sani'  },
                    { name: 'Faculty of Sciences',      code: 'SCI', hod_name: 'Prof. Ngozi Obi'      },
                        { name: 'Library',                  code: 'LIB', hod_name: 'Mr. Ibrahim Tanko'    },
                            { name: 'Registry',                 code: 'REG', hod_name: 'Mr. Ahmed Tanko'      },
                                { name: 'Finance Department',       code: 'FIN', hod_name: 'Mrs. Fatima Aliyu'    },
                                    { name: 'Works and Maintenance',    code: 'WRK', hod_name: 'Engr. Bala Mohammed'  },
                                        { name: 'Medical Centre',           code: 'MED', hod_name: 'Dr. Grace Okonkwo'    },
                                            { name: 'Student Affairs',          code: 'STA', hod_name: 'Dr. Yusuf Adamu'      },
                                                { name: 'Bursary',                  code: 'BUR', hod_name: 'Mr. Chukwu Emmanuel'  },
                                                    { name: 'Procurement Unit',         code: 'PRO', hod_name: 'Mr. Uche Okafor'      },
                                                        { name: 'Vice Chancellor Office',   code: 'VCO', hod_name: 'Prof. Yakubu Ibrahim' },
                                                          ]);
                                                          };
}
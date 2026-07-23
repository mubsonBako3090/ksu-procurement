const bcrypt = require('bcryptjs');

exports.seed = async (knex) => {
  await knex('users').del();

    const hash  = await bcrypt.hash('Password@123', 12);
      const depts = await knex('departments').select('id', 'code');
        const dept  = (code) => depts.find((d) => d.code === code)?.id;

          await knex('users').insert([
              {
                    name:     'Dr. Amina Bello',
                          email:    'requester@ksu.edu.ng',
                                password: hash,
                                      role:     'requester',
                                            dept_id:  dept('ICT'),
                                                  staff_id: 'KSU/STF/001',
                                                        phone:    '08012345678',
                                                            },
                                                                {
                                                                      name:     'Prof. Musa Garba',
                                                                            email:    'hod@ksu.edu.ng',
                                                                                  password: hash,
                                                                                        role:     'hod',
                                                                                              dept_id:  dept('ICT'),
                                                                                                    staff_id: 'KSU/STF/002',
                                                                                                          phone:    '08023456789',
                                                                                                              },
                                                                                                                  {
                                                                                                                        name:     'Mr. Uche Okafor',
                                                                                                                              email:    'procurement@ksu.edu.ng',
                                                                                                                                    password: hash,
                                                                                                                                          role:     'procurement',
                                                                                                                                                dept_id:  dept('PRO'),
                                                                                                                                                      staff_id: 'KSU/STF/003',
                                                                                                                                                            phone:    '08034567890',
                                                                                                                                                                },
                                                                                                                                                                    {
                                                                                                                                                                          name:     'Mrs. Fatima Aliyu',
                                                                                                                                                                                email:    'finance@ksu.edu.ng',
                                                                                                                                                                                      password: hash,
                                                                                                                                                                                            role:     'finance',
                                                                                                                                                                                                  dept_id:  dept('FIN'),
                                                                                                                                                                                                        staff_id: 'KSU/STF/004',
                                                                                                                                                                                                              phone:    '08045678901',
                                                                                                                                                                                                                  },
                                                                                                                                                                                                                      {
                                                                                                                                                                                                                            name:     'Prof. Yakubu Ibrahim',
                                                                                                                                                                                                                                  email:    'vc@ksu.edu.ng',
                                                                                                                                                                                                                                        password: hash,
                                                                                                                                                                                                                                              role:     'vc',
                                                                                                                                                                                                                                                    dept_id:  dept('VCO'),
                                                                                                                                                                                                                                                          staff_id: 'KSU/STF/005',
                                                                                                                                                                                                                                                                phone:    '08056789012',
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                              name:     'System Administrator',
                                                                                                                                                                                                                                                                                    email:    'admin@ksu.edu.ng',
                                                                                                                                                                                                                                                                                          password: hash,
                                                                                                                                                                                                                                                                                                role:     'admin',
                                                                                                                                                                                                                                                                                                      dept_id:  null,
                                                                                                                                                                                                                                                                                                            staff_id: 'KSU/STF/000',
                                                                                                                                                                                                                                                                                                                  phone:    '08067890123',
                                                                                                                                                                                                                                                                                                                      },
                                                                                                                                                                                                                                                                                                                        ]);
                                                                                                                                                                                                                                                                                                                        };
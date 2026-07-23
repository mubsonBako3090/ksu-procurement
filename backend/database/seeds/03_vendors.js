exports.seed = async (knex) => {
      await knex('vendors').del();
        await knex('vendors').insert([
            {
                  name:        'Kaduna Global Supplies Ltd',
                        email:       'info@kadunaglobal.com',
                              phone:       '08011112222',
                                    location:    'Kaduna',
                                          address:     '12 Independence Way, Kaduna',
                                                rc_number:   'RC123456',
                                                      is_verified: true,
                                                            rating:      4.5,
                                                                },
                                                                    {
                                                                          name:        'Northern Office Solutions',
                                                                                email:       'contact@northernoffice.com',
                                                                                      phone:       '08022223333',
                                                                                            location:    'Abuja',
                                                                                                  address:     '45 Wuse Zone 5, Abuja',
                                                                                                        rc_number:   'RC234567',
                                                                                                              is_verified: true,
                                                                                                                    rating:      4.2,
                                                                                                                        },
                                                                                                                            {
                                                                                                                                  name:        'TechBridge Nigeria Ltd',
                                                                                                                                        email:       'sales@techbridge.ng',
                                                                                                                                              phone:       '08033334444',
                                                                                                                                                    location:    'Lagos',
                                                                                                                                                          address:     '78 Victoria Island, Lagos',
                                                                                                                                                                rc_number:   'RC345678',
                                                                                                                                                                      is_verified: true,
                                                                                                                                                                            rating:      4.8,
                                                                                                                                                                                },
                                                                                                                                                                                    {
                                                                                                                                                                                          name:        'Sahel Procurement Services',
                                                                                                                                                                                                email:       'info@sahelprocure.com',
                                                                                                                                                                                                      phone:       '08044445555',
                                                                                                                                                                                                            location:    'Kaduna',
                                                                                                                                                                                                                  address:     '23 Ahmadu Bello Way, Kaduna',
                                                                                                                                                                                                                        rc_number:   'RC456789',
                                                                                                                                                                                                                              is_verified: true,
                                                                                                                                                                                                                                    rating:      3.9,
                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                  name:        'Zaria General Merchants',
                                                                                                                                                                                                                                                        email:       'zaria@merchants.com',
                                                                                                                                                                                                                                                              phone:       '08055556666',
                                                                                                                                                                                                                                                                    location:    'Zaria',
                                                                                                                                                                                                                                                                          address:     '5 Tudun Wada Road, Zaria',
                                                                                                                                                                                                                                                                                rc_number:   null,
                                                                                                                                                                                                                                                                                      is_verified: false,
                                                                                                                                                                                                                                                                                            rating:      4.1,
                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                  ]);
                                                                                                                                                                                                                                                                                                  };
}
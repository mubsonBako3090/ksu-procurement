module.exports = {

      ROLES: {
          REQUESTER:   'requester',
              HOD:         'hod',
                  PROCUREMENT: 'procurement',
                      FINANCE:     'finance',
                          VC:          'vc',
                              ADMIN:       'admin',
                                },

                                  STATUS: {
                                      DRAFT:       'draft',
                                          PENDING_HOD: 'pending_hod',
                                              PENDING_PROC:'pending_procurement',
                                                  PENDING_FIN: 'pending_finance',
                                                      PENDING_VC:  'pending_vc',
                                                          APPROVED:    'approved',
                                                              REJECTED:    'rejected',
                                                                },

                                                                  PRIORITY: {
                                                                      LOW:    'low',
                                                                          MEDIUM: 'medium',
                                                                              HIGH:   'high',
                                                                                  URGENT: 'urgent',
                                                                                    },

                                                                                      APPROVAL_ROLES: ['hod', 'procurement', 'finance', 'vc'],

                                                                                        NEXT_STATUS: {
                                                                                            hod:         'pending_procurement',
                                                                                                procurement: 'pending_finance',
                                                                                                    finance:     'pending_vc',
                                                                                                        vc:          'approved',
                                                                                                          },

                                                                                                            // Nigerian Public Procurement Thresholds (₦)
                                                                                                              THRESHOLDS: {
                                                                                                                  DIRECT_PURCHASE: 50000,
                                                                                                                      HOD_LIMIT:       500000,
                                                                                                                          FINANCE_LIMIT:   2000000,
                                                                                                                            },

                                                                                                                              PAGINATION: {
                                                                                                                                  DEFAULT_PAGE:  1,
                                                                                                                                      DEFAULT_LIMIT: 20,
                                                                                                                                        },
                                                                                                                                        };
}
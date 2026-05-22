export const SEED_CONTACTS = [
  {
    id: 'seed-1', full_name: 'David Lee', role: 'Director',
    company: 'Collen Construction', country: 'Ireland',
    email: 'david.lee@collen.ie', status: 'Contacted',
    interest_level: 'High', segment: 'Leadership', source: 'Phone call',
    owner: 'Ciaran', next_followup: '2026-05-24', last_contacted: '2026-05-17',
    notes: 'Gary Morris is key decision maker. Open to coffee meeting next week.',
    created_at: '2026-05-10T09:00:00Z', updated_at: '2026-05-17T14:00:00Z',
  },
  {
    id: 'seed-2', full_name: "Mary O'Brien", role: 'Procurement Manager',
    company: 'BAM Ireland', country: 'Ireland',
    email: 'm.obrien@bamireland.ie', status: 'New lead',
    interest_level: 'Medium', segment: 'Commercial', source: 'LinkedIn',
    owner: 'Ciaran', next_followup: '2026-05-22', last_contacted: '2026-05-15',
    notes: '', created_at: '2026-05-12T10:00:00Z', updated_at: '2026-05-15T09:00:00Z',
  },
  {
    id: 'seed-3', full_name: 'Patrick Sisk', role: 'Operations Director',
    company: 'John Sisk & Son', country: 'Ireland',
    email: 'p.sisk@sisk.ie', status: 'Meeting booked',
    interest_level: 'High', segment: 'Operations', source: 'Referral',
    owner: 'Ciaran', next_followup: '2026-05-28', last_contacted: '2026-05-16',
    notes: 'Demo scheduled. Very interested in cost estimation module.',
    created_at: '2026-05-08T11:00:00Z', updated_at: '2026-05-16T16:00:00Z',
  },
  {
    id: 'seed-4', full_name: 'Tom Walsh', role: 'Head of Preconstruction',
    company: 'DPR Construction', country: 'USA',
    email: 't.walsh@dpr.com', status: 'Contacted',
    interest_level: 'Medium', segment: 'Preconstruction', source: 'Apollo',
    owner: 'Ciaran', next_followup: '2026-05-17', last_contacted: '2026-05-10',
    notes: '', created_at: '2026-05-05T08:00:00Z', updated_at: '2026-05-10T13:00:00Z',
  },
  {
    id: 'seed-5', full_name: 'Sarah Chen', role: 'Digital Director',
    company: 'Multiplex', country: 'Australia',
    email: 's.chen@multiplex.com', status: 'Interested',
    interest_level: 'High', segment: 'Digital', source: 'LinkedIn',
    owner: 'Ciaran', next_followup: '2026-05-20', last_contacted: '2026-05-08',
    notes: 'Very interested in BIM integration angle.',
    created_at: '2026-05-01T09:00:00Z', updated_at: '2026-05-08T10:00:00Z',
  },
  {
    id: 'seed-6', full_name: 'James Murphy', role: 'Commercial Director',
    company: 'Sisk & Son', country: 'Ireland',
    email: 'j.murphy@sisk.ie', status: 'Met',
    interest_level: 'High', segment: 'Commercial', source: 'Event',
    owner: 'Ciaran', next_followup: '2026-05-25', last_contacted: '2026-05-12',
    notes: 'Met at CIF dinner. Keen on preconstruction module.',
    created_at: '2026-04-28T10:00:00Z', updated_at: '2026-05-12T17:00:00Z',
  },
]

export const SEED_ACTIVITIES = [
  {
    id: 'act-1', contact_id: 'seed-3', type: 'meeting',
    title: 'Product demo call', body: 'Walked through the preconstruction module. Patrick very engaged, asked about API integrations.',
    occurred_at: '2026-05-16T10:00:00Z', owner: 'Ciaran',
  },
  {
    id: 'act-2', contact_id: 'seed-1', type: 'call',
    title: 'Intro call', body: 'Spoke with David for 20 mins. He mentioned Gary Morris is the real decision maker on tech spend.',
    occurred_at: '2026-05-17T14:00:00Z', owner: 'Ciaran',
  },
  {
    id: 'act-3', contact_id: 'seed-5', type: 'email',
    title: 'Follow-up email sent', body: 'Sent BIM integration overview document as requested.',
    occurred_at: '2026-05-08T09:30:00Z', owner: 'Ciaran',
  },
  {
    id: 'act-4', contact_id: 'seed-6', type: 'meeting',
    title: 'CIF dinner intro', body: 'Brief intro at the table. Exchanged cards. James asked for a deck.',
    occurred_at: '2026-05-12T19:00:00Z', owner: 'Ciaran',
  },
]

export const SEED_DEALS = [
  {
    id: 'deal-1', contact_id: 'seed-3', title: 'Sisk — Preconstruction Module',
    stage: 'Meeting booked', value_eur: 24000, currency: 'EUR',
    close_date: '2026-06-30', owner: 'Ciaran', notes: 'Demo went well.',
    created_at: '2026-05-08T00:00:00Z', updated_at: '2026-05-16T00:00:00Z',
  },
  {
    id: 'deal-2', contact_id: 'seed-5', title: 'Multiplex — Digital Pilot',
    stage: 'Proposal sent', value_eur: 48000, currency: 'EUR',
    close_date: '2026-07-15', owner: 'Ciaran', notes: '',
    created_at: '2026-05-01T00:00:00Z', updated_at: '2026-05-10T00:00:00Z',
  },
  {
    id: 'deal-3', contact_id: 'seed-6', title: 'BAM Ireland — Full Platform',
    stage: 'Contacted', value_eur: 72000, currency: 'EUR',
    close_date: '2026-08-01', owner: 'Ciaran', notes: '',
    created_at: '2026-04-28T00:00:00Z', updated_at: '2026-05-12T00:00:00Z',
  },
  {
    id: 'deal-4', contact_id: 'seed-1', title: 'Collen — Initial Trial',
    stage: 'New lead', value_eur: 12000, currency: 'EUR',
    close_date: '2026-07-01', owner: 'Ciaran', notes: '',
    created_at: '2026-05-10T00:00:00Z', updated_at: '2026-05-17T00:00:00Z',
  },
]

export const SEED_INVESTORS = [
  {
    id: 'inv-1', name: 'Seedcamp', type: 'VC Fund', contact_name: 'Partner',
    contact_email: 'hello@seedcamp.com', stage: 'Term sheet',
    target_amount_eur: 75000, committed_amount_eur: 75000,
    last_contacted: '2026-05-12', next_followup: '2026-05-20',
    next_step: 'Sign docs', notes: 'Strong interest in construction tech vertical.',
    owner: 'Ciaran', created_at: '2026-04-01T00:00:00Z', updated_at: '2026-05-12T00:00:00Z',
  },
  {
    id: 'inv-2', name: 'Enterprise Ireland', type: 'Govt Grant',
    contact_name: 'Advisor', contact_email: '', stage: 'First meeting',
    target_amount_eur: 50000, committed_amount_eur: 0,
    last_contacted: '2026-05-08', next_followup: '2026-05-22',
    next_step: 'Submit HPSU application', notes: 'HPSU application in progress.',
    owner: 'Ciaran', created_at: '2026-04-10T00:00:00Z', updated_at: '2026-05-08T00:00:00Z',
  },
  {
    id: 'inv-3', name: 'Angel — John Murphy', type: 'Angel',
    contact_name: 'John Murphy', contact_email: 'jm@example.com', stage: 'First meeting',
    target_amount_eur: 25000, committed_amount_eur: 0,
    last_contacted: '2026-05-05', next_followup: '2026-05-18',
    next_step: 'Send deck', notes: 'Former construction MD. Very relevant background.',
    owner: 'Ciaran', created_at: '2026-04-15T00:00:00Z', updated_at: '2026-05-05T00:00:00Z',
  },
  {
    id: 'inv-4', name: 'SOSV / HAX', type: 'Accelerator',
    contact_name: 'Scout', contact_email: '', stage: 'Intro made',
    target_amount_eur: 0, committed_amount_eur: 0,
    last_contacted: '2026-05-01', next_followup: '2026-05-25',
    next_step: 'Coffee meeting', notes: 'Warm intro via network.',
    owner: 'Ciaran', created_at: '2026-04-20T00:00:00Z', updated_at: '2026-05-01T00:00:00Z',
  },
]

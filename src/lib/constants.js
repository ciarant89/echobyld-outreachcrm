export const CONTACT_STATUSES = [
  'New lead', 'Contacted', 'Meeting booked', 'Met',
  'Interested', 'Not interested', 'Proposal sent', 'Closed won', 'Closed lost',
  'Not proceeding', 'Not returned',
]

export const PIPELINE_STAGES = [
  'New lead', 'Contacted', 'Meeting booked', 'Proposal sent', 'Follow up', 'Closed won',
]

export const ACTIVITY_TYPES  = ['call', 'email', 'meeting', 'note', 'voice_note']
export const COUNTRIES        = ['Ireland', 'UK', 'Australia', 'USA', 'Canada', 'Other']
export const SEGMENTS         = ['Preconstruction', 'Commercial', 'Digital', 'Operations', 'Leadership', 'Other']
export const INTEREST_LEVELS  = ['High', 'Medium', 'Low', 'Unknown']
export const SOURCES          = ['Apollo', 'LinkedIn', 'Referral', 'Phone call', 'Event', 'Cold outreach', 'eTenders', 'Other']
export const INVESTOR_STAGES  = ['New lead', 'Intro made', 'First meeting', 'Due diligence', 'Term sheet', 'Closed', 'Passed']
export const INVESTOR_TYPES   = ['VC Fund', 'Angel', 'Govt Grant', 'Accelerator', 'Corporate VC', 'Scout', 'Family Office']
export const TIERS            = ['Tier 1', 'Tier 2', 'Tier 3']

export const STATUS_STYLES = {
  'New lead':       { bg: '#E8F0FF', text: '#1A3A8F', border: '#B3C8F5' },
  'Contacted':      { bg: '#FFF3E0', text: '#7A3800', border: '#FFB74D' },
  'Meeting booked': { bg: '#F3E8FF', text: '#5B1FA0', border: '#CE93D8' },
  'Met':            { bg: '#E8F5E9', text: '#1B5E20', border: '#81C784' },
  'Interested':     { bg: '#E8F5E9', text: '#1B5E20', border: '#81C784' },
  'Not interested': { bg: '#FFEBEE', text: '#7F0000', border: '#EF9A9A' },
  'Proposal sent':  { bg: '#FFF8E1', text: '#7A5500', border: '#FFD54F' },
  'Closed won':     { bg: '#ADCCB7', text: '#0D1F12', border: '#60866C' },
  'Closed lost':    { bg: '#ECEFF1', text: '#455A64', border: '#B0BEC5' },
  'Not proceeding': { bg: '#ECEFF1', text: '#455A64', border: '#B0BEC5' },
  'Not returned':   { bg: '#FFF3E0', text: '#7A3800', border: '#FFB74D' },
  'Follow up':      { bg: '#E0F7FA', text: '#00596B', border: '#80DEEA' },
  'Intro made':     { bg: '#E8F0FF', text: '#1A3A8F', border: '#B3C8F5' },
  'First meeting':  { bg: '#F3E8FF', text: '#5B1FA0', border: '#CE93D8' },
  'Due diligence':  { bg: '#FFF3E0', text: '#7A3800', border: '#FFB74D' },
  'Term sheet':     { bg: '#ADCCB7', text: '#0D1F12', border: '#60866C' },
  'Closed':         { bg: '#ADCCB7', text: '#0D1F12', border: '#60866C' },
  'Passed':         { bg: '#ECEFF1', text: '#455A64', border: '#B0BEC5' },
}

export const ACTIVITY_STYLES = {
  call:       { bg: '#E8F5E9', text: '#1B5E20', border: '#81C784',  label: 'Call'       },
  email:      { bg: '#E8F0FF', text: '#1A3A8F', border: '#B3C8F5',  label: 'Email'      },
  meeting:    { bg: '#F3E8FF', text: '#5B1FA0', border: '#CE93D8',  label: 'Meeting'    },
  note:       { bg: '#FFF3E0', text: '#7A3800', border: '#FFB74D',  label: 'Note'       },
  voice_note: { bg: '#ADCCB7', text: '#0D1F12', border: '#60866C',  label: 'Voice note' },
}

export const STAGE_BORDER_COLORS = {
  'New lead':       '#B3C8F5',
  'Contacted':      '#60866C',
  'Meeting booked': '#CE93D8',
  'Proposal sent':  '#FFD54F',
  'Follow up':      '#80DEEA',
  'Closed won':     '#ADCCB7',
}

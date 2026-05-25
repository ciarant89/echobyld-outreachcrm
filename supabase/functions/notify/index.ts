import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const RECIPIENTS = ['ciaran@echobyld.com', 'john@echobyld.com']
// Use onboarding@resend.dev until echobyld.com domain is verified in Resend
const FROM = 'EchoByld CRM <onboarding@resend.dev>'

serve(async (req) => {
  if (req.method !== 'POST') return new Response('OK', { status: 200 })

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { type, table, record, old_record } = payload

  let subject = ''
  let html = ''

  if (table === 'contacts') {
    if (type === 'INSERT') {
      subject = `New contact added: ${record.full_name}`
      html = contactCreatedHtml(record)
    } else if (type === 'UPDATE' && old_record?.status !== record.status) {
      subject = `Contact status changed: ${record.full_name}`
      html = contactStatusChangedHtml(record, old_record)
    } else {
      return new Response('No email needed', { status: 200 })
    }
  } else if (table === 'deals') {
    if (type === 'INSERT') {
      subject = `New deal created: ${record.title}`
      html = dealCreatedHtml(record)
    } else if (type === 'UPDATE' && old_record?.stage !== record.stage) {
      subject = `Deal stage changed: ${record.title}`
      html = dealMovedHtml(record, old_record)
    } else {
      return new Response('No email needed', { status: 200 })
    }
  } else if (table === 'activities') {
    if (type === 'INSERT') {
      subject = `Activity logged: ${record.title || record.type}`
      html = activityLoggedHtml(record)
    } else {
      return new Response('No email needed', { status: 200 })
    }
  } else {
    return new Response('Unknown table', { status: 200 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM, to: RECIPIENTS, subject, html }),
  })

  return new Response(await res.text(), { status: res.status })
})

// ── helpers ──────────────────────────────────────────────────────────────────

function wrap(title: string, body: string) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4F7F5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="540" cellpadding="0" cellspacing="0"
        style="background:#fff;border-radius:12px;border:1px solid #D4E0D8;overflow:hidden;">
        <tr>
          <td style="background:#0D1F12;padding:20px 28px;">
            <div style="font-size:18px;font-weight:700;color:#ADCCB7;">EchoByld CRM</div>
            <div style="font-size:13px;color:#60866C;margin-top:3px;">${title}</div>
          </td>
        </tr>
        <tr><td style="padding:24px 28px;">${body}</td></tr>
        <tr>
          <td style="padding:14px 28px;background:#F4F7F5;border-top:1px solid #D4E0D8;">
            <div style="font-size:11px;color:#4A6352;">
              Sent automatically by EchoByld CRM · Reply to this email to unsubscribe.
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function infoRow(label: string, value: string) {
  if (!value) return ''
  return `<tr>
    <td style="padding:5px 0;font-size:13px;color:#4A6352;width:110px;vertical-align:top;">${label}</td>
    <td style="padding:5px 0;font-size:13px;color:#0D1F12;font-weight:600;">${value}</td>
  </tr>`
}

function stagePill(from: string, to: string) {
  return `<div style="background:#F4F7F5;border-radius:8px;padding:14px;text-align:center;margin:16px 0;">
    <span style="font-size:14px;color:#4A6352;">${from || '—'}</span>
    <span style="font-size:14px;color:#0D1F12;margin:0 12px;font-weight:700;">→</span>
    <span style="font-size:14px;color:#33533D;font-weight:700;">${to}</span>
  </div>`
}

function notesBlock(notes: string) {
  if (!notes) return ''
  return `<div style="margin-top:16px;padding:12px 14px;background:#F4F7F5;border-radius:8px;
    font-size:13px;color:#0D1F12;border-left:3px solid #ADCCB7;">
    ${notes.replace(/\n/g, '<br>')}
  </div>`
}

function heading(text: string) {
  return `<div style="font-size:17px;font-weight:700;color:#0D1F12;margin-bottom:16px;">${text}</div>`
}

// ── templates ─────────────────────────────────────────────────────────────────

function contactCreatedHtml(c: any) {
  const name = c.company ? `${c.full_name} · <span style="color:#60866C;">${c.company}</span>` : c.full_name
  return wrap('New Contact Added', `
    ${heading(name)}
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Role', c.role)}
      ${infoRow('Email', c.email)}
      ${infoRow('Phone', c.phone)}
      ${infoRow('Country', c.country)}
      ${infoRow('Status', c.status)}
      ${infoRow('Segment', c.segment)}
      ${infoRow('Source', c.source)}
      ${infoRow('Owner', c.owner)}
    </table>
    ${notesBlock(c.notes)}
  `)
}

function contactStatusChangedHtml(c: any, old: any) {
  return wrap('Contact Status Changed', `
    ${heading(c.full_name)}
    ${c.company ? `<div style="font-size:13px;color:#60866C;margin-top:-10px;margin-bottom:12px;">${c.company}</div>` : ''}
    ${stagePill(old?.status, c.status)}
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Owner', c.owner)}
    </table>
  `)
}

function dealCreatedHtml(d: any) {
  const value = d.value_eur > 0
    ? `€${Number(d.value_eur).toLocaleString('en-IE')}`
    : ''
  const closeDate = d.close_date
    ? new Date(d.close_date).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  return wrap('New Deal Created', `
    ${heading(d.title)}
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Stage', d.stage)}
      ${infoRow('Value', value)}
      ${infoRow('Close date', closeDate)}
      ${infoRow('Owner', d.owner)}
    </table>
    ${notesBlock(d.notes)}
  `)
}

function dealMovedHtml(d: any, old: any) {
  const value = d.value_eur > 0
    ? `€${Number(d.value_eur).toLocaleString('en-IE')}`
    : ''
  return wrap('Deal Stage Changed', `
    ${heading(d.title)}
    ${stagePill(old?.stage, d.stage)}
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Value', value)}
      ${infoRow('Owner', d.owner)}
    </table>
  `)
}

function activityLoggedHtml(a: any) {
  const date = a.occurred_at
    ? new Date(a.occurred_at).toLocaleString('en-IE', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : ''
  return wrap('Activity Logged', `
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:4px;">
      ${infoRow('Type', a.type)}
      ${infoRow('Title', a.title)}
      ${infoRow('Owner', a.owner)}
      ${infoRow('Date', date)}
    </table>
    ${notesBlock(a.body)}
  `)
}

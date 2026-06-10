/**
 * Google Apps Script web app that receives "Join the Mailing List" signups from the
 * website and appends them as rows to the bound Google Sheet.
 *
 * Posted to by src/app/(frontend)/mailing-list/subscribe/route.ts.
 * See README.md in this folder for setup/deploy steps.
 *
 * Dynamic by design: it writes a column for every field in the payload. To add a new
 * field later, just include it in the hook's POST body — a matching column is created
 * automatically here, no Apps Script change or redeploy needed.
 */

// Must match the GOOGLE_SHEETS_WEBHOOK_SECRET env var in the site.
const SHARED_SECRET = 'CHANGE_ME'

// Tab to append to. Leave blank to use the first tab (robust to its name).
const SHEET_NAME = ''

// Friendly column headers for known payload keys; preferred left-to-right order.
// Any payload key not listed here still gets a column (using its raw key as the header),
// appended after these.
const FIELD_LABELS = {
  submittedAt: 'Timestamp',
  name: 'Name',
  email: 'Email',
  location: 'Location',
  phone: 'Phone',
  source: 'Source',
}
const PREFERRED_ORDER = ['submittedAt', 'name', 'email', 'location', 'phone', 'source']

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}')

    if (body.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'unauthorized' })
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0]
    if (!sheet) {
      return json({ ok: false, error: 'sheet not found: ' + SHEET_NAME })
    }

    // All data keys from the payload (everything except the secret), preferred order first.
    const dataKeys = Object.keys(body).filter(function (k) {
      return k !== 'secret'
    })
    const keys = PREFERRED_ORDER.filter(function (k) {
      return dataKeys.indexOf(k) !== -1
    }).concat(
      dataKeys.filter(function (k) {
        return PREFERRED_ORDER.indexOf(k) === -1
      }),
    )

    // Read existing headers (row 1) and add any missing columns for this payload.
    const lastCol = sheet.getLastColumn()
    let headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String) : []
    keys.forEach(function (k) {
      const label = FIELD_LABELS[k] || k
      if (headers.indexOf(label) === -1) {
        headers.push(label)
        sheet.getRange(1, headers.length, 1, 1).setValue(label)
      }
    })

    // Map values by their header label, then build a row aligned to the header order.
    const valueByLabel = {}
    keys.forEach(function (k) {
      const label = FIELD_LABELS[k] || k
      valueByLabel[label] =
        k === 'submittedAt' ? (body.submittedAt ? new Date(body.submittedAt) : new Date()) : body[k]
    })
    const row = headers.map(function (h) {
      return valueByLabel[h] != null ? valueByLabel[h] : ''
    })

    sheet.appendRow(row)
    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

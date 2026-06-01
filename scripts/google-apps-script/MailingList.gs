/**
 * Google Apps Script web app that receives "Join the Mailing List" signups from the
 * website and appends them as rows to the bound Google Sheet.
 *
 * Posted to by src/hooks/forwardFormSubmissionToSheet.ts.
 * See README.md in this folder for setup/deploy steps.
 *
 * Expected JSON body:
 *   { secret, email, location, phone, source, submittedAt }
 */

// Must match the GOOGLE_SHEETS_WEBHOOK_SECRET env var in the site.
const SHARED_SECRET = 'CHANGE_ME'

// Tab to append to. Leave blank to use the first tab (robust to its name).
const SHEET_NAME = ''

const HEADERS = ['Timestamp', 'Email', 'Location', 'Phone', 'Source']

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

    // Self-initialize the header row on an empty sheet.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS)
    }

    sheet.appendRow([
      body.submittedAt ? new Date(body.submittedAt) : new Date(),
      body.email || '',
      body.location || '',
      body.phone || '',
      body.source || 'website',
    ])

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

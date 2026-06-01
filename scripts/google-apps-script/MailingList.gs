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

// Name of the tab to append to (rename if your tab isn't "Sheet1").
const SHEET_NAME = 'Sheet1'

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}')

    if (body.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'unauthorized' })
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    if (!sheet) {
      return json({ ok: false, error: 'sheet not found: ' + SHEET_NAME })
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

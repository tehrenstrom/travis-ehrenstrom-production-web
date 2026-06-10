# Mailing List → Google Sheet (Apps Script web app)

This folder holds the Google Apps Script that receives "Join the Mailing List" signups from the
website and appends them to a Google Sheet in your Drive. It's the receiver that
`src/app/(frontend)/mailing-list/subscribe/route.ts` POSTs to.

## One-time setup

1. **Create a Google Sheet** in your Drive (e.g. "TEB Mailing List"). In the first row, add headers:

   | Timestamp | Email | Location | Phone | Source |
   | --------- | ----- | -------- | ----- | ------ |

2. **Add the script.** In the Sheet: **Extensions → Apps Script**. Delete the placeholder code and
   paste the contents of [`MailingList.gs`](./MailingList.gs).

3. **Set a secret.** In the script, change `SHARED_SECRET` from `'CHANGE_ME'` to a long random
   string. Save. (It writes to the first tab and adds the header row automatically, so the tab name
   doesn't matter; set `SHEET_NAME` only if you want to target a specific tab.)

4. **Deploy as a web app.** Click **Deploy → New deployment → ⚙️ → Web app**:
   - Description: `Mailing list receiver`
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy**, authorize when prompted, and copy the **Web app URL** (ends in `/exec`).

5. **Configure the site.** Set these environment variables (in `.env` for local dev and in
   Vercel → Project → Settings → Environment Variables):

   ```
   GOOGLE_SHEETS_WEBHOOK_URL=<the /exec URL from step 4>
   GOOGLE_SHEETS_WEBHOOK_SECRET=<the same secret you set in step 3>
   ```

## Test it directly

```bash
curl -X POST "$GOOGLE_SHEETS_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d '{"secret":"YOUR_SECRET","email":"test@example.com","location":"Bend, OR","phone":"555-1212","source":"curl-test"}'
```

Expect `{"ok":true}` and a new row in the Sheet.

## Adding a new field later

The script is **dynamic** — it writes a column for every key in the POST body and auto-creates the
column header if it's missing. So adding a field is a code-only change, no Apps Script edit needed:

1. Add the field to the form in `src/endpoints/seedMailingList.ts` and re-seed.
2. Add the field to the POST body in `src/app/(frontend)/mailing-list/subscribe/route.ts`.

A new column appears in the Sheet automatically on the next signup. (Give it a friendly header by
adding the key to `FIELD_LABELS`/`PREFERRED_ORDER` in `MailingList.gs` and redeploying — optional.)

## Updating the script later

After editing `MailingList.gs` in the Apps Script editor, **Deploy → Manage deployments → edit
(✏️) → Version: New version → Deploy**. The `/exec` URL stays the same, so no env changes are needed.

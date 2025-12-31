import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

async function updateContactFormEmails() {
  const payload = await getPayload({ config: configPromise })

  // Find the contact form
  const { docs: forms } = await payload.find({
    collection: 'forms',
    where: {
      title: { equals: 'Contact Form' },
    },
  })

  if (forms.length === 0) {
    console.log('Contact Form not found')
    process.exit(1)
  }

  const form = forms[0]
  console.log(`Found Contact Form with ID: ${form.id}`)

  // Update with email configuration
  await payload.update({
    collection: 'forms',
    id: form.id,
    data: {
      emails: [
        {
          emailTo: 'travis@travisehrenstrom.com',
          emailFrom: '"Website Contact" <noreply@tebmusic.com>',
          subject: 'New Contact Form Submission from {{fullName}}',
          message: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 1,
                      mode: 'normal',
                      style: '',
                      text: 'New message from your website contact form:',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: '{{*:table}}',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
      ],
    },
  })

  console.log('✅ Contact Form updated with email configuration!')
  console.log('   Emails will be sent to: travis@travisehrenstrom.com')
  console.log('   From: noreply@tebmusic.com')

  process.exit(0)
}

updateContactFormEmails().catch((err) => {
  console.error('Error updating form:', err)
  process.exit(1)
})


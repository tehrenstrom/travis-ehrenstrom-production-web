import { test, expect } from '@playwright/test'

const BASE = `http://localhost:${process.env.E2E_PORT || '3000'}`

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto(BASE)

    await expect(page).toHaveTitle(/Travis Ehrenstrom/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Songs about people and place, played with friends.')
  })

  const pages: { path: string; h1: string | RegExp }[] = [
    { path: '/mailing-list', h1: 'Stay in the loop' },
    { path: '/booking', h1: 'Booking & Press' },
    { path: '/booking/solo', h1: 'Travis Ehrenstrom — solo' },
    { path: '/booking/teb', h1: 'TEB' },
    { path: '/house-concerts', h1: 'Host a house concert' },
    { path: '/contact', h1: 'Say hello' },
    { path: '/store', h1: 'Store' },
  ]

  for (const { path, h1 } of pages) {
    test(`renders ${path}`, async ({ page }) => {
      await page.goto(`${BASE}${path}`)
      await expect(page.locator('h1').first()).toHaveText(h1)
    })
  }

  test('/list redirects to /mailing-list (QR alias)', async ({ page }) => {
    await page.goto(`${BASE}/list`)
    await expect(page).toHaveURL(`${BASE}/mailing-list`)
    await expect(page.locator('h1').first()).toHaveText('Stay in the loop')
  })

  test('flat press-kit slugs redirect to nested paths', async ({ page }) => {
    await page.goto(`${BASE}/booking-solo`)
    await expect(page).toHaveURL(`${BASE}/booking/solo`)
  })

  test('home shows the two-doors chooser and capture form', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.getByRole('heading', { name: 'Pick your room' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Join the list' }).first()).toBeVisible()
  })
})

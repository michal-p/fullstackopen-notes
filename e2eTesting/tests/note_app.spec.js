const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'mario',
        username: 'super',
        password: 'salainenQ$1'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes').first()
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('super')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('logged-in')).not.toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'super', 'salainenQ$1')

    await expect(page.getByText('logged-in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'super', 'salainenQ$1')
    })

    test('a new note can be created', async ({ page }) => {
      createNote(page, 'a note created by playwright')

      await expect(page.getByText('a note created by playwright').first()).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        createNote(page, 'another note by playwright')
      })

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note', true)
        await createNote(page, 'second note', true)
        await createNote(page, 'third note', true)
      })

      test('one of those can be made non important', async ({ page }) => {
        // await page.pause()
        const secondNoteText = await page.getByText('second note')
        const parentNoteElement = await secondNoteText.locator('..')
        await parentNoteElement.getByRole('button', { name: 'make not important' }).click()

        await expect(parentNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})

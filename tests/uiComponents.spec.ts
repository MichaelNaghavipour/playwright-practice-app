import { test, expect } from '@playwright/test'
import { Tooltip } from 'leaflet'

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts Page', () => {
    test.beforeEach( async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' })
        .getByRole('textbox', { name: /email/i }) // making 'Email' Case-Insensitive

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test@gmail.com', { delay: 250 })

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test@gmail.com')

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test@gmail.com')
    })

    test('Radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        // await usingTheGridForm.getByLabel('Option 1').check({ force: true })
        await usingTheGridForm.getByRole('radio', { name: "Option 1"}).check({ force: true })
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: "Option 1"}).isChecked()
        expect(radioStatus).toBeTruthy()
        await expect(usingTheGridForm.getByRole('radio', { name: "Option 1"})).toBeChecked()

        await usingTheGridForm.getByRole('radio', { name: "Option 2"}).check({ force: true })
        expect(await usingTheGridForm.getByRole('radio', { name: "Option 2"}).isChecked()).toBeTruthy()
        expect(await usingTheGridForm.getByRole('radio', { name: "Option 1"}).isChecked()).toBeFalsy()
    })
})

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', { name: "Hide on click"}).uncheck({ force: true })
    await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast"}).check({ force: true })

    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
        expect(await box.isChecked()).toBeTruthy()
    }

    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        expect(await box.isChecked()).toBeFalsy
    }
})

test('Lists and Dropdowns', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    // await page.locator('ngx-header nb-select').click()
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Dark"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()
    for(const color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color !== 'Corporate')
            await dropDownMenu.click()
    }
})

test('Tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await toolTipCard.getByRole('button', { name: 'TOP'}).hover()
    // const tooltip = await page.locator('nb-tooltip').textContent()
    // expect(tooltip).toEqual('This is a tooltip')
    await expect(page.locator('nb-tooltip')).toHaveText('This is a tooltip')
})
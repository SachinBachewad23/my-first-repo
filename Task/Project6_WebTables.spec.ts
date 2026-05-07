import{test,expect} from '@playwright/test'

test('verify element search', async({page}) => {

    await page.goto('https://app.thetestingacademy.com/playwright/webtable');

    //search for kabir and click on select cloud qa button
    await page.locator('#employee-search').fill('Kabir')
    await page.getByText('Select Cloud QA', { exact: true }).click();

    //verify that only kabir is visible in the table
    const usernameCell = page.locator('tbody tr:visible td.username');
    await expect(usernameCell).toHaveText('Kabir.Khan');

    //click the checkbox next to kabir and verify that it is checked  
    const checkbox = page.locator('//td[text()="Kabir.Khan"]/preceding-sibling::td//input[@type="checkbox"]');
    await checkbox.check();
    await expect(checkbox).toBeChecked();


});
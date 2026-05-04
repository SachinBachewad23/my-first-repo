import {test,expect} from "@playwright/test";

test('Check If Balance is refelcted after withdraw',async ({page})=>{

    let balance: number = 0.00;
    let transferAmount=5000.00;
    let expectedFinalBalnce: number=0.00;

    // Go to page URL and sign up
    await page.goto("https://tta-bank-digital-973242068062.us-west1.run.app/");
    await page.getByRole('button', { name : 'Sign Up'}).click();

    // Fill the form and create account
    await page.getByPlaceholder('John Doe').fill("Meeti");
    await page.getByPlaceholder('you@example.com').fill("meeti@example.com");
    await page.locator("input[type='password']").fill("ThisIsNotAPassword");
    await page.getByRole('button', { name : 'Create Account'}).click();

    // Check Initial Balance
    let balanceLocator= page.locator('//p[text()="Total Balance"]/following-sibling::h3');
    let balanceText= await balanceLocator.textContent() ?? ""; // converts null to "" null coaleshing. This is required otherwise balanceText couldnt be passed as argument as it is of type string | null . 
    balance= textBalanceToNumberConverter(balanceText); // balanceText is of type string is ensured

    // Click on transfer funds and fill the details and click on Continue
    await page.getByRole('button', { name : 'Transfer Funds'}).click();
    await page.getByPlaceholder('0.00').fill(`${transferAmount}`);
    await page.getByPlaceholder('e.g. Rent for October').fill("Rent");
    await page.getByRole('button', { name : 'Continue'}).click();

    //Confirm the transfer and click on confirm
    await page.getByRole('button', { name : 'Confirm Transfer'}).click();

    //Go to Dashboard again
    await page.getByRole('button', { name : 'Dashboard'}).click();

    // Calculate expected Amount
    expectedFinalBalnce= balance-transferAmount; // calculating expected balance

    balanceText = await balanceLocator.textContent() ?? ""; // converts null to "" 
    balance= textBalanceToNumberConverter(balanceText);

    //Validation
    //Way 1: 
    expect (balance).toBe(expectedFinalBalnce); // calculating difference and checking

    //Way 2: 
     await expect(balanceLocator).toHaveText("$45,000.00"); // Easier Hardcoded way but works.
  
});

  function textBalanceToNumberConverter(balance :String) :number
    {
        return parseFloat(balance.replace(/[$,]/g, "")); // /g here means all occurance of $ and , will be replaced with "" not just first
        // return parseFloat(balance.replaceAll("$", "").replaceAll(",", "")); // This also can be used instead
    }
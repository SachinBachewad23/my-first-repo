import { test, expect } from "@playwright/test";

test("Invalid Email validation", async ({ page }) => {
    //await page.goto("https://app.vwo.com/#login");
    //await page.getByText("Start a FREE TRIAL", {exact :true}).click();

    await page.goto("https://vwo.com/free-trial/?utm_medium=website&utm_source=login-page&utm_campaign=mof_eg_loginpage");

    await page.getByRole('textbox', { name: 'Business Email' }).pressSequentially("abc@gmail.com", { delay: 300 });

    await expect(page.getByText("gmail.com doesn't look like a business domain. Please use your business email.")).toBeVisible();   


});
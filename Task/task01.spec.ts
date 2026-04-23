// 1. Got to - >https://katalon-demo-cura.herokuapp.com/
// 2. Click On the make appointment.  
// 3. Next page, Enter the username and password
// 4. https://katalon-demo-cura.herokuapp.com/#appointment We need to verify that the URL is now changed to this. 
// 5. And verify The page contains heading Make Appointment


import { test, expect } from "@playwright/test";

test("Verify login functionality of Katalon Cura website", async ({ page }) => {

    // 1. Got to - >https://katalon-demo-cura.herokuapp.com/
    await page.goto("https://katalon-demo-cura.herokuapp.com");

    // 2. Click On the make appointment. 

     let makeAppointmentButton = page.locator("#btn-make-appointment");
     await makeAppointmentButton.click();

    // 3. Next page,  Enter the username and password
   
      let username = page.locator('#txt-username');
      let password= page.locator('#txt-password');
      let loginButton = page.locator('#btn-login');
      
      await username.fill("John Doe");
      await password.fill("ThisIsNotAPassword");
      await loginButton.click();

      // 4. Verify the changed URL
      await expect (page).toHaveURL("https://katalon-demo-cura.herokuapp.com/#appointment");
      
      // 5. And verify The page contains heading Make Appointment
       let heading = page.locator('.col-sm-12.text-center');
       await expect(heading).toContainText("Make Appointment");

});
import { test, expect, Page } from '@playwright/test';
import path from 'path';

const BASE_URL ="https://app.thetestingacademy.com/playwright/tables/practice";
const uploadFilePath= "tests/Projects/Project#5 - QA Profile Form/sample-upload.txt";
const downloadFilePath="tests/Projects/Project#5 - QA Profile Form/Downloads/sample-download.txt";

interface personalInformation
{
    firstName: string;
    lastName: string;
    gender: string;
    yearsOfExperience: number;
    date: Date;
    profession: string;
    automationTools: string[]
    continentsWorkedFrom: string[]
   
}

async function fillPersonalInformation(page: Page, personalInfo: personalInformation) :Promise<void>
{
   // Fill Personal Information
   await page.getByRole('textbox', {name:'First name'}).fill(personalInfo.firstName);
   await page.getByRole('textbox',{name: 'Last name'}).fill(personalInfo.lastName);
   await page.getByRole('radio',({name : personalInfo.gender})).click();

   await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue(personalInfo.firstName);
   await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue(personalInfo.lastName);
   await expect(page.getByRole('radio', { name: personalInfo.gender })).toBeChecked();
   
   // Fill Professional Details
   await page.selectOption('#years-experience',`${personalInfo.yearsOfExperience}`);
   await expect(page.locator('#years-experience')).toHaveValue(String(personalInfo.yearsOfExperience));

   //Fill Date
   const formattedDate = personalInfo.date.toISOString().split('T')[0];
   // toISOString() -> converts to 2026-11-10T00:00:00.000Z
   // .split('T')[0]; -> gives 2026-11-10
   await page.locator('#profile-date').fill(formattedDate);
   await expect(page.locator('#profile-date')).toHaveValue(formattedDate);
   
   await await page.getByLabel(personalInfo.profession).click();
   await expect(page.getByLabel(personalInfo.profession)).toBeChecked();

   // Update technical skills
   for(const tool of personalInfo.automationTools)
   {
        await page.getByRole('checkbox', {name : tool}).check();
        await expect(page.getByRole('checkbox', {name : tool})).toBeChecked();
   }

   for(const continent of personalInfo.continentsWorkedFrom)
   {
    await page.getByRole('checkbox',{name : continent}).check();
    await expect(page.getByRole('checkbox',{name : continent})).toBeChecked();
   }
}

async function verifyTabSwitch(page: Page) :Promise<void>
{
  await page.getByRole('tab', {name: 'Navigation Commands'}).click();
  expect (page.locator('#selenium-tab-panel')).toContainText("Navigation commands");
}

async function fileOperations(page: Page, uploadFilePath: string, downloadfilePath: string) :Promise<void>
{
  
    //Upload File
  await page.locator('#upload-image').setInputFiles(uploadFilePath);
  //extracting filename
  const fileName = path.basename(uploadFilePath);
  await expect(page.locator('#upload-file-name')).toContainText(fileName);
  
    //Download File Flow
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-file').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('sample-download.txt');
  await download.saveAs(downloadFilePath);

}

async function saveProfile(page:Page) :Promise<void>
{
    await page.getByRole('button', { name: 'Save profile' }).click();
}

async function  verifySubmittedData(page: Page, personalInfo : personalInformation) :Promise<void>
{

const outputText= await page.locator('.submission-output').textContent();
const outputJson = JSON.parse(outputText || '{}');
const formattedDate = personalInfo.date.toISOString().split('T')[0];

  expect(outputJson).toMatchObject({
  firstName: personalInfo.firstName,
  lastName: personalInfo.lastName,
  gender: personalInfo.gender,
  yearsExperience: String(personalInfo.yearsOfExperience),
  date: formattedDate,
  profession: personalInfo.profession,
  tools: personalInfo.automationTools, // Array data provided in correct order so works
  //continents: personalInfo.continentsWorkedFrom,// Array data provided in random order
  upload: {} // This is a bug, as filename is not mentioned
});

//continents checked seprately because in data I provided Europe before Asia

// Order Matters
// expect(outputJson.continents).toEqual(personalInfo.continentsWorkedFrom);// will give error as output will be Asia, Europe

// Order doesnt matter
expect(outputJson.continents).toEqual(expect.arrayContaining(personalInfo.continentsWorkedFrom)); // If we want order shouldnt matter
}

test ('Verify if form is filled and submitted Successfully',async({page})=>{

    
    await page.goto(BASE_URL);

    const personalInfo : personalInformation= {
    firstName: "Meeti",
    lastName: "Jha",
    gender: "Female",
    yearsOfExperience: 5,
    date: new Date("2026-11-10") ,
    profession: "Automation Tester",
    automationTools: ['UFT','Selenium Webdriver'],
    continentsWorkedFrom: ['Europe','Asia']
    }
    await fillPersonalInformation(page,personalInfo);
    await verifyTabSwitch(page);
    await fileOperations(page, uploadFilePath,downloadFilePath);


    await saveProfile(page);

    await verifySubmittedData(page,personalInfo);
});
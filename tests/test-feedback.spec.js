import { test, expect } from '@playwright/test';

test('test-see-feedback', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // กรอกข้อมูลเข้าสู่ระบบ
  await page.getByRole('textbox', { name: 'Input Field' }).fill('b6510405351');
  await page.getByRole('textbox', { name: 'Input Password' }).fill('210746_Ttt');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

  // รอให้ปุ่ม "11 รายละเอียด" ปรากฏแล้วกด
  await page.waitForSelector('div:has-text("11 รายละเอียด")', { state: 'visible' });
  await page.locator('div').filter({ hasText: /^11 รายละเอียด$/ }).getByRole('button').click();

  // รอให้ Feedback ปรากฏแทนการใช้ waitForTimeout
  const feedbackText = 'ไม่ระบุตัวตนjjjjjjjjjaaaaaaajajajjajajaj';
  await page.waitForSelector(`text=${feedbackText}`, { state: 'visible' });

  // คลิกที่ Feedback
  const targetElement = await page.getByText(feedbackText);
  await expect(targetElement).toBeVisible();
  await targetElement.click();
});

test('test-send-feedback-anonymously', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // กรอกข้อมูลเข้าสู่ระบบ
  await page.getByRole('textbox', { name: 'Input Field' }).fill('b6510405351');
  await page.getByRole('textbox', { name: 'Input Password' }).fill('210746_Ttt');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

  // รอให้ปุ่ม "11 รายละเอียด" ปรากฏแล้วกด
  await page.waitForSelector('div:has-text("11 รายละเอียด")', { state: 'visible' });
  await page.locator('div').filter({ hasText: /^11 รายละเอียด$/ }).getByRole('button').click();

  // รอให้ปุ่ม "ส่ง Feedback" ปรากฏแล้วกด
  await page.waitForSelector('div:has-text("ส่ง Feedback")', { state: 'visible' });
  await page.locator('div').filter({ hasText: 'ส่ง Feedback' }).nth(1).click();

  // รอให้ Textbox ปรากฏแล้วพิมพ์ข้อความ
  const feedbackTextbox = await page.getByRole('textbox', { name: 'เขียน Feedback' });
  await feedbackTextbox.waitFor({ state: 'visible' });
  await feedbackTextbox.fill('commetn feedback brrab arrasdra');

  // จัดการ Dialog ที่อาจเกิดขึ้น
  page.once('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.dismiss();
  });

  // คลิกส่ง Feedback แบบไม่ระบุตัวตน
  await page.getByRole('button', { name: 'ส่ง Feedback แบบไม่ระบุตัวตน' }).click();

  // รอให้ Feedback ปรากฏแล้วตรวจสอบ
  const feedbackText = 'ไม่ระบุตัวตนcommetn feedback';
  await page.waitForSelector(`text=${feedbackText}`, { state: 'visible' });
  const feedbackElement = await page.getByText(feedbackText);
  await expect(feedbackElement).toBeVisible();
  await feedbackElement.click();
});



test('test-send-feedback', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // กรอกข้อมูลเข้าสู่ระบบ
  await page.getByRole('textbox', { name: 'Input Field' }).fill('b6510405351');
  await page.getByRole('textbox', { name: 'Input Password' }).fill('210746_Ttt');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

  // รอให้ปุ่ม "11 รายละเอียด" ปรากฏแล้วกด
  await page.waitForSelector('div:has-text("11 รายละเอียด")', { state: 'visible' });
  await page.locator('div').filter({ hasText: /^11 รายละเอียด$/ }).getByRole('button').click();

  // รอให้ปุ่ม "ส่ง Feedback" ปรากฏแล้วกด
  await page.waitForSelector('div:has-text("ส่ง Feedback")', { state: 'visible' });
  await page.locator('div').filter({ hasText: 'ส่ง Feedback' }).nth(1).click();

  // รอให้ Textbox ปรากฏแล้วพิมพ์ข้อความ
  const feedbackTextbox = await page.getByRole('textbox', { name: 'เขียน Feedback' });
  await feedbackTextbox.waitFor({ state: 'visible' });
  await page.getByRole('textbox', { name: 'เขียน Feedback' }).fill(';saldflaskdfjs;lfslfsadfjslksssfffsjdlksfjlksfjl');

  // จัดการ Dialog ที่อาจเกิดขึ้น
  page.once('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.dismiss();
  });

  // คลิกส่ง Feedback
  await page.getByRole('button', { name: 'ส่ง Feedback', exact: true }).click();

  // รอให้ Feedback ปรากฏแล้วตรวจสอบ
  const feedbackText = 'Kriengkai;saldflaskdfjs;';
  await page.waitForSelector(`text=${feedbackText}`, { state: 'visible' });
  const feedbackElement = await page.getByText(feedbackText);
  await expect(feedbackElement).toBeVisible();
  await feedbackElement.click();
});



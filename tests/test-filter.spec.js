import { test, expect } from '@playwright/test';

test('test-filter-location', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Input Field' }).click();
  await page.getByRole('textbox', { name: 'Input Field' }).fill('b6510405351');
  await page.getByRole('textbox', { name: 'Input Field' }).press('Tab');
  await page.getByRole('textbox', { name: 'Input Password' }).fill('210746_Ttt');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.locator('select[name="location"]').selectOption('1');
  await page.locator('div').filter({ hasText: '1โดย Kriengkai Seethong2025-' }).nth(3).click();
  const targetDiv = await page.locator('div').filter({ hasText: '1โดย Kriengkai Seethong2025-' }).nth(3);
  
  await expect(targetDiv).toBeVisible(); 
});

test('test-filter-date', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Input Field' }).click();
  await page.getByRole('textbox', { name: 'Input Field' }).fill('b6510405351');
  await page.getByRole('textbox', { name: 'Input Field' }).press('Tab');
  await page.getByRole('textbox', { name: 'Input Password' }).fill('210746_Ttt');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.locator('select[name="date"]').selectOption('2025-03-15');
  await page.locator('div').filter({ hasText: '2โดย Kriengkai Seethong2025-' }).nth(3).click();
  const targetDiv = await page.locator('div').filter({ hasText: '2โดย Kriengkai Seethong2025-' }).nth(3);
  
  // ตรวจสอบว่า element ที่มีข้อความตรงกับที่ต้องการมีอยู่
  await expect(targetDiv).toBeVisible(); 
});

test('test-filter-type', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Input Field' }).click();
  await page.getByRole('textbox', { name: 'Input Field' }).fill('b6510405351');
  await page.getByRole('textbox', { name: 'Input Field' }).press('Tab');
  await page.getByRole('textbox', { name: 'Input Password' }).fill('210746_Ttt');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.locator('select[name="type"]').selectOption('2');
  await page.locator('div').filter({ hasText: '2โดย Kriengkai Seethong2025-' }).nth(3).click();
  const targetDiv = await page.locator('div').filter({ hasText: '2โดย Kriengkai Seethong2025-' }).nth(3);
  
  // ตรวจสอบว่า element ที่มีข้อความตรงกับที่ต้องการมีอยู่
  await expect(targetDiv).toBeVisible(); 
});
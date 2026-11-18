import { test, expect, type Page } from '@playwright/test';

const THEME_LABEL = /Switch to (light|dark) mode/;

function themeToggle(page: Page) {
	return page.locator('.theme-toggle');
}

async function currentTheme(page: Page): Promise<'dark' | 'light'> {
	const theme = await page.locator('html').getAttribute('data-theme');
	if (theme !== 'dark' && theme !== 'light') {
		throw new Error(`Unexpected theme: ${theme}`);
	}
	return theme;
}

async function waitForHydration(page: Page) {
	const theme = await currentTheme(page);
	const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
	await expect(themeToggle(page)).toHaveAttribute('aria-label', label, { timeout: 15_000 });
}

test.describe('theme toggle', () => {
	test.beforeEach(async ({ page }) => {
		await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
		await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
		await page.goto('/', { waitUntil: 'domcontentloaded' });
		await waitForHydration(page);
	});

	test('switches the theme attribute and keeps its layout position', async ({ page }) => {
		const html = page.locator('html');
		const toggle = themeToggle(page);
		const initial = await currentTheme(page);
		const next = initial === 'dark' ? 'light' : 'dark';
		const nextLabel = next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

		const before = await toggle.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
		});

		await toggle.click();

		await expect(html).toHaveAttribute('data-theme', next);
		await expect(toggle).toHaveAttribute('aria-label', nextLabel);

		await expect
			.poll(() => page.evaluate(() => document.documentElement.classList.contains('theme-view-transition')))
			.toBe(false);

		const after = await toggle.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
		});
		expect(after).toEqual(before);
	});

	test('persists the selected theme after a reload', async ({ page }) => {
		const html = page.locator('html');
		const toggle = themeToggle(page);
		const initial = await currentTheme(page);
		const next = initial === 'dark' ? 'light' : 'dark';

		await toggle.click();
		await expect(html).toHaveAttribute('data-theme', next);
		await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe(next);

		await page.reload({ waitUntil: 'domcontentloaded' });
		await expect(html).toHaveAttribute('data-theme', next);
		await waitForHydration(page);
		await expect(toggle).toHaveAttribute(
			'aria-label',
			next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
		);
	});

	test('keeps the selected theme across project navigation', async ({ page }) => {
		const html = page.locator('html');
		const toggle = themeToggle(page);
		const initial = await currentTheme(page);
		const next = initial === 'dark' ? 'light' : 'dark';

		await toggle.click();
		await expect(html).toHaveAttribute('data-theme', next);

		await page.locator('.project-index__list a').first().click();
		await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
		await expect(html).toHaveAttribute('data-theme', next);
		await expect(toggle).toHaveAttribute(
			'aria-label',
			next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
		);
	});

	test('has an accessible label', async ({ page }) => {
		const toggle = page.getByRole('button', { name: THEME_LABEL });
		await expect(toggle).toBeVisible();
		await expect(toggle).toHaveAccessibleName(THEME_LABEL);
	});

	test('switches instantly when reduced motion is preferred', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		const html = page.locator('html');
		const toggle = themeToggle(page);
		const initial = await currentTheme(page);
		const next = initial === 'dark' ? 'light' : 'dark';

		await toggle.click();

		await expect(html).toHaveAttribute('data-theme', next);
		await expect(html).not.toHaveClass(/theme-view-transition/);
		await expect(html).not.toHaveClass(/theme-fallback/);
		await expect(toggle).toHaveAttribute(
			'aria-label',
			next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
		);
	});

	test('defaults to the system preference when nothing is saved', async ({ page }) => {
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	});
});

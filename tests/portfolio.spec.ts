import { test, expect, type Page } from '@playwright/test';
import { projects } from '../src/data/projects';

const FAVICONS = [
	'/favicon.ico',
	'/favicon-32x32.png',
	'/favicon.svg',
	'/apple-touch-icon.png',
];

function lines(projectBody: string[]): string[] {
	return projectBody.flatMap((entry) => entry.split(/\r?\n/).map((line) => line.trim()));
}

function bulletItems(projectBody: string[]): string[] {
	return lines(projectBody)
		.filter((line) => line.startsWith('- '))
		.map((line) => line.slice(2).trim());
}

function techItems(projectBody: string[]): string[] {
	return lines(projectBody)
		.filter((line) => /^Tech:\s*/i.test(line))
		.flatMap((line) =>
			line
				.replace(/^Tech:\s*/i, '')
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean),
		);
}

async function openHome(page: Page) {
	await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
	await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
	await page.goto('/', { waitUntil: 'domcontentloaded' });
	await page.locator('.project-gallery[data-hydrated]').waitFor({ state: 'attached', timeout: 15_000 });
}

test.describe('portfolio', () => {
	test('loads the home page with every project card', async ({ page }) => {
		await openHome(page);

		await expect(page).toHaveTitle(/SROS THAI/);
		await expect(page.getByRole('heading', { level: 1, name: 'Selected work' })).toBeVisible();
		await expect(page.locator('.project-card')).toHaveCount(projects.length);
	});

	test('filters projects by category', async ({ page }) => {
		await openHome(page);

		const categories = [...new Set(projects.map((project) => project.subtitle))];
		for (const category of categories) {
			const button = page.getByRole('button', { name: category, exact: true });
			await button.click();
			await expect(button).toHaveAttribute('aria-pressed', 'true');

			const expected = projects.filter((project) => project.subtitle === category);
			await expect(page.locator('.project-card')).toHaveCount(expected.length);
			await expect(page.locator('.project-card__pill')).toHaveText(
				expected.map(() => category),
			);
		}

		await page.getByRole('button', { name: 'All', exact: true }).click();
		await expect(page.locator('.project-card')).toHaveCount(projects.length);
	});

	test('renders an image, title, summary, and equal height for every card', async ({ page }) => {
		await openHome(page);

		const cards = page.locator('.project-card');
		const heights: number[] = [];

		for (let index = 0; index < projects.length; index += 1) {
			const project = projects[index];
			const card = cards.nth(index);
			const image = card.locator('img');
			const summary = card.locator('.project-card__summary');

			await expect(card.locator('.project-card__title')).toHaveText(project.title);
			await expect(summary).toHaveText(project.summary);
			await expect(image).toHaveAttribute('src', project.cover);
			await expect(image).toHaveAttribute('alt', project.coverAlt);
			await expect
				.poll(() => summary.evaluate((element) => getComputedStyle(element).webkitLineClamp))
				.toBe('2');

			await image.scrollIntoViewIfNeeded();
			await expect
				.poll(() =>
					image.evaluate((element) => {
						const img = element as HTMLImageElement;
						return img.complete && img.naturalWidth > 0;
					}),
				)
				.toBe(true);

			const box = await card.boundingBox();
			expect(box).not.toBeNull();
			heights.push(box!.height);
		}

		expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
	});

	test('opens a project detail page with bullets, tech tags, and links', async ({ page }) => {
		const project =
			projects.find(
				(item) =>
					item.links.length > 0 &&
					bulletItems(item.body).length > 0 &&
					techItems(item.body).length > 0,
			) ?? projects[0];

		await openHome(page);
		await page.locator(`.project-card[href="/projects/${project.slug}/"]`).click();

		await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}/?$`));
		await expect(page.getByRole('heading', { level: 1, name: project.title })).toBeVisible();
		await expect(page.locator('.detail__lead')).toHaveText(project.summary);

		const bullets = bulletItems(project.body);
		await expect(page.locator('.detail__bullets li')).toHaveCount(bullets.length);
		expect(await page.locator('.detail__bullets li').allTextContents()).toEqual(bullets);

		const tech = techItems(project.body);
		await expect(page.locator('.detail__tags li')).toHaveCount(tech.length);
		expect(await page.locator('.detail__tags li').allTextContents()).toEqual(tech);

		const actions = page.locator('.detail__actions a');
		await expect(actions).toHaveCount(project.links.length);
		for (let index = 0; index < project.links.length; index += 1) {
			await expect(actions.nth(index)).toHaveAttribute('href', project.links[index].href);
			await expect(actions.nth(index)).toContainText(project.links[index].label);
		}
	});

	test('links and serves the favicon assets', async ({ page }) => {
		await openHome(page);

		await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
		await expect(
			page.locator('link[rel="icon"][type="image/png"][sizes="32x32"][href="/favicon-32x32.png"]'),
		).toHaveCount(1);
		await expect(
			page.locator('link[rel="icon"][type="image/svg+xml"][href="/favicon.svg"]'),
		).toHaveCount(1);
		await expect(
			page.locator('link[rel="apple-touch-icon"][sizes="180x180"][href="/apple-touch-icon.png"]'),
		).toHaveCount(1);

		for (const href of FAVICONS) {
			const response = await page.request.get(href);
			expect(response.ok(), `${href} should be served`).toBeTruthy();
			expect((await response.body()).byteLength).toBeGreaterThan(0);
		}
	});

	test('does not overflow horizontally', async ({ page }) => {
		await openHome(page);

		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
		);
		expect(overflow).toBeLessThanOrEqual(1);
	});
});

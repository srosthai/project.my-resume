import { test, expect, type Page } from '@playwright/test';
import { projects } from '../src/data/projects';

const FAVICONS = [
	'/favicon.ico',
	'/favicon-32x32.png',
	'/favicon.svg',
	'/apple-touch-icon.png',
];

const CATEGORY_ORDER = ['Full Stack', 'Frontend', 'Backend', 'Desktop App'];
const PREVIEW_LIMIT = 2;

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
	await page.locator('.folder-gallery[data-hydrated]').waitFor({ state: 'attached', timeout: 15_000 });
}

test.describe('portfolio', () => {
	test('loads the home page with a folder for every discipline and a complete index', async ({ page }) => {
		await openHome(page);

		await expect(page).toHaveTitle(/SROS THAI/);
		await expect(page.getByRole('heading', { level: 1, name: 'Selected work' })).toBeVisible();

		const categories = [...new Set(projects.map((project) => project.subtitle))];
		await expect(page.locator('.folder-group')).toHaveCount(categories.length);

		for (const category of categories) {
			await expect(
				page.getByRole('button', { name: `${category} folder`, exact: true }),
			).toBeVisible();
		}

		await expect(page.locator('.project-index__list a')).toHaveCount(projects.length);
	});

	test('opens one category folder at a time and links to its index group', async ({ page }) => {
		await openHome(page);

		const groups = page.locator('.folder-group');
		const fullStack = page.getByRole('button', { name: 'Full Stack folder', exact: true });
		const frontend = page.getByRole('button', { name: 'Frontend folder', exact: true });
		const fullStackGroup = groups.nth(0);

		await fullStack.click();
		await expect(fullStack).toHaveAttribute('aria-expanded', 'true');
		await expect(fullStackGroup.locator('[data-folder-item]')).toHaveCount(2);
		await expect(fullStackGroup.locator('[data-folder-item="0"] .folder-paper__title')).toHaveText(
			'Tosder Communities',
		);
		await expect(fullStackGroup.locator('[data-folder-item="1"] .folder-paper__title')).toHaveText(
			'Vendly',
		);

		await frontend.click();
		await expect(frontend).toHaveAttribute('aria-expanded', 'true');
		await expect(fullStack).toHaveAttribute('aria-expanded', 'false');
		await expect(fullStackGroup.locator('[data-folder-item="0"]')).toHaveAttribute('tabindex', '-1');

		await fullStackGroup.locator('.folder-group__meta').click();
		await expect(page).toHaveURL(/#category-full-stack$/);
		await expect(page.locator('#category-full-stack')).toBeInViewport();
	});

	test('opens a project from a folder preview', async ({ page }) => {
		await openHome(page);

		const project = projects.find((item) => item.subtitle === 'Full Stack');
		if (!project) throw new Error('Missing Full Stack project');

		const fullStack = page.getByRole('button', { name: 'Full Stack folder', exact: true });
		await fullStack.click();
		await expect(fullStack).toHaveAttribute('aria-expanded', 'true');

		await page.locator('.folder-group').nth(0).locator('[data-folder-item="0"]').click();

		await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}/?$`));
		await expect(page.getByRole('heading', { level: 1, name: project.title })).toBeVisible();
	});

	test('exposes canonical, social metadata, and profile structured data', async ({ page }) => {
		await openHome(page);

		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			'https://projects.srosthai.me/',
		);
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'profile');
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
			'content',
			'SROS THAI — Full Stack Developer Portfolio',
		);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			'content',
			'https://projects.srosthai.me/og-image.jpg',
		);
		await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
			'content',
			'1200',
		);
		await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
			'content',
			'630',
		);
		await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
			'content',
			'summary_large_image',
		);

		const schema = await page.locator('script[type="application/ld+json"]').first().textContent();
		if (!schema) throw new Error('Missing JSON-LD');
		const graph = (JSON.parse(schema) as { '@graph': Array<Record<string, unknown>> })['@graph'];
		expect(graph.map((node) => node['@type'])).toEqual(
			expect.arrayContaining(['Person', 'WebSite', 'ProfilePage']),
		);
	});

	test('serves sitemap, robots, and the social preview image', async ({ page }) => {
		const sitemap = await page.request.get('/sitemap.xml');
		expect(sitemap.ok()).toBeTruthy();
		const sitemapText = await sitemap.text();
		expect(sitemapText).toContain('<loc>https://projects.srosthai.me/</loc>');
		expect(sitemapText).toContain(
			`<loc>https://projects.srosthai.me/projects/${projects[0].slug}/</loc>`,
		);

		const robots = await page.request.get('/robots.txt');
		expect(robots.ok()).toBeTruthy();
		expect(await robots.text()).toContain('Sitemap: https://projects.srosthai.me/sitemap.xml');

		const preview = await page.request.get('/og-image.jpg');
		expect(preview.ok()).toBeTruthy();
		expect(preview.headers()['content-type']).toContain('image/jpeg');
		expect((await preview.body()).byteLength).toBeGreaterThan(10_000);
	});

	test('previews recent projects and lists every project in the index', async ({ page }) => {
		await openHome(page);

		const groups = page.locator('.folder-group');
		const orderedCategories = [
			...CATEGORY_ORDER.filter((category) =>
				projects.some((project) => project.subtitle === category),
			),
			...new Set(
				projects
					.map((project) => project.subtitle)
					.filter((category) => !CATEGORY_ORDER.includes(category)),
			),
		];

		await expect(groups).toHaveCount(orderedCategories.length);

		for (let groupIndex = 0; groupIndex < orderedCategories.length; groupIndex += 1) {
			const category = orderedCategories[groupIndex];
			const expected = projects.filter((project) => project.subtitle === category);
			const previews = expected.slice(0, PREVIEW_LIMIT);
			const group = groups.nth(groupIndex);

			await expect(group.locator('.folder-group__count')).toHaveText(String(expected.length));
			await expect(group.locator('[data-folder-item]')).toHaveCount(previews.length);

			for (let previewIndex = 0; previewIndex < previews.length; previewIndex += 1) {
				const preview = previews[previewIndex];
				const item = group.locator(`[data-folder-item="${previewIndex}"]`);
				const image = item.locator('img.folder-paper__cover');

				await expect(item.locator('.folder-paper__title')).toHaveText(preview.title);
				await expect(image).toHaveAttribute('src', preview.cover);
				await expect(image).toHaveAttribute('alt', '');

				await image.scrollIntoViewIfNeeded();
				await expect
					.poll(() =>
						image.evaluate((element) => {
							const img = element as HTMLImageElement;
							return img.complete && img.naturalWidth > 0;
						}),
					)
					.toBe(true);
			}
		}

		const widths: number[] = [];
		for (const group of await groups.all()) {
			const box = await group.locator('[data-mode="flap"]').boundingBox();
			expect(box).not.toBeNull();
			widths.push(box!.width);
		}
		expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);

		const rows = await page
			.locator('.project-index__list a')
			.evaluateAll((links) =>
				links.map((link) => ({
					href: link.getAttribute('href'),
					title: link.querySelector('.project-index__title')?.textContent?.trim(),
				})),
			);

		const expectedRows = projects
			.map((project) => ({ href: `/projects/${project.slug}/`, title: project.title }))
			.sort((a, b) => a.href.localeCompare(b.href));
		expect(rows).toHaveLength(projects.length);
		expect(rows.sort((a, b) => String(a.href).localeCompare(String(b.href)))).toEqual(expectedRows);
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
		await page.locator(`.project-index__list a[href="/projects/${project.slug}/"]`).click();

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

		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			`https://projects.srosthai.me/projects/${project.slug}/`,
		);
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			'content',
			new URL(project.cover, 'https://projects.srosthai.me').href,
		);

		const schema = await page.locator('script[type="application/ld+json"]').first().textContent();
		if (!schema) throw new Error('Missing JSON-LD');
		const graph = (JSON.parse(schema) as { '@graph': Array<Record<string, unknown>> })['@graph'];
		expect(graph.map((node) => node['@type'])).toEqual(
			expect.arrayContaining(['Person', 'WebSite', 'CreativeWork', 'BreadcrumbList']),
		);
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

	test('does not overflow horizontally with a folder open', async ({ page }) => {
		await openHome(page);

		const folder = page.getByRole('button', { name: 'Full Stack folder', exact: true });
		await folder.click();
		await expect(folder).toHaveAttribute('aria-expanded', 'true');

		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
		);
		expect(overflow).toBeLessThanOrEqual(1);
	});
});

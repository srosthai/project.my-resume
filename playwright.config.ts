import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 2,
	timeout: 60_000,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:4322',
		colorScheme: 'light',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'desktop',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 900 },
			},
		},
		{
			name: 'mobile',
			use: {
				...devices['Pixel 5'],
				viewport: { width: 390, height: 844 },
			},
		},
	],
	webServer: {
		command: 'npm run build && npx --no-install vite preview --host 127.0.0.1 --port 4322 --strictPort',
		url: 'http://127.0.0.1:4322',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});

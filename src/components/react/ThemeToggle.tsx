import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
	if (typeof document === 'undefined') return 'dark';
	const attr = document.documentElement.getAttribute('data-theme');
	if (attr === 'light' || attr === 'dark') return attr;
	try {
		const stored = localStorage.getItem('theme');
		if (stored === 'light' || stored === 'dark') return stored;
	} catch {
		/* ignore */
	}
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
	document.documentElement.setAttribute('data-theme', theme);
	try {
		localStorage.setItem('theme', theme);
	} catch {
		/* ignore */
	}
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		const next = readTheme();
		setTheme(next);
		applyTheme(next);
	}, []);

	const toggle = () => {
		const next: Theme = theme === 'dark' ? 'light' : 'dark';
		setTheme(next);
		applyTheme(next);
	};

	const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

	return (
		<button
			type="button"
			className="theme-toggle"
			onClick={toggle}
			aria-label={label}
			title={label}
		>
			<span className="theme-toggle__icon" aria-hidden="true">
				{theme === 'dark' ? (
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75" />
						<path
							d="M12 2.75v2.1M12 19.15v2.1M2.75 12h2.1M19.15 12h2.1M5.05 5.05l1.5 1.5M17.45 17.45l1.5 1.5M5.05 18.95l1.5-1.5M17.45 6.55l1.5-1.5"
							stroke="currentColor"
							strokeWidth="1.75"
							strokeLinecap="round"
						/>
					</svg>
				) : (
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
						<path
							d="M20.2 14.1A8.4 8.4 0 0 1 9.9 3.8a7.1 7.1 0 1 0 10.3 10.3Z"
							stroke="currentColor"
							strokeWidth="1.75"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</span>
		</button>
	);
}

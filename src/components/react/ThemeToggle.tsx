import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'dark' | 'light';

type ViewTransitionDocument = Document & {
	startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

const FALLBACK_DURATION = 320;

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

function applyTheme(theme: Theme, persist = true) {
	document.documentElement.setAttribute('data-theme', theme);
	if (!persist) return;
	try {
		localStorage.setItem('theme', theme);
	} catch {
		/* ignore */
	}
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>('dark');
	const buttonRef = useRef<HTMLButtonElement>(null);
	const fallbackTimer = useRef<number | null>(null);
	const transitionToken = useRef(0);

	useEffect(() => {
		const next = readTheme();
		setTheme(next);
		applyTheme(next, false);
	}, []);

	useEffect(() => {
		return () => {
			transitionToken.current += 1;
			if (fallbackTimer.current !== null) {
				window.clearTimeout(fallbackTimer.current);
			}
			const root = document.documentElement;
			root.classList.remove('theme-fallback', 'theme-view-transition');
			root.style.removeProperty('--theme-reveal-x');
			root.style.removeProperty('--theme-reveal-y');
		};
	}, []);

	const toggle = () => {
		const next: Theme = theme === 'dark' ? 'light' : 'dark';
		const root = document.documentElement;
		const button = buttonRef.current;
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const doc = document as ViewTransitionDocument;

		if (reduceMotion) {
			root.classList.remove('theme-fallback', 'theme-view-transition');
			applyTheme(next);
			setTheme(next);
			return;
		}

		const runFallback = () => {
			transitionToken.current += 1;
			root.classList.remove('theme-view-transition');
			root.style.removeProperty('--theme-reveal-x');
			root.style.removeProperty('--theme-reveal-y');
			root.classList.add('theme-fallback');
			applyTheme(next);
			setTheme(next);
			if (fallbackTimer.current !== null) {
				window.clearTimeout(fallbackTimer.current);
			}
			fallbackTimer.current = window.setTimeout(() => {
				root.classList.remove('theme-fallback');
				fallbackTimer.current = null;
			}, FALLBACK_DURATION);
		};

		if (!doc.startViewTransition || !button) {
			runFallback();
			return;
		}

		const rect = button.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;
		const token = ++transitionToken.current;

		root.style.setProperty('--theme-reveal-x', `${x}px`);
		root.style.setProperty('--theme-reveal-y', `${y}px`);
		root.classList.add('theme-view-transition');

		try {
			const transition = doc.startViewTransition(() => {
				flushSync(() => {
					applyTheme(next);
					setTheme(next);
				});
			});

			const cleanup = () => {
				if (token !== transitionToken.current) return;
				root.classList.remove('theme-view-transition');
				root.style.removeProperty('--theme-reveal-x');
				root.style.removeProperty('--theme-reveal-y');
			};

			transition.finished.then(cleanup, cleanup);
		} catch {
			runFallback();
		}
	};

	const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

	return (
		<button
			ref={buttonRef}
			type="button"
			className="theme-toggle"
			onClick={toggle}
			aria-label={label}
			title={label}
		>
			<span className="theme-toggle__icon" aria-hidden="true">
				<svg
					className="theme-toggle__icon-sun"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
				>
					<circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75" />
					<path
						d="M12 2.75v2.1M12 19.15v2.1M2.75 12h2.1M19.15 12h2.1M5.05 5.05l1.5 1.5M17.45 17.45l1.5 1.5M5.05 18.95l1.5-1.5M17.45 6.55l1.5-1.5"
						stroke="currentColor"
						strokeWidth="1.75"
						strokeLinecap="round"
					/>
				</svg>
				<svg
					className="theme-toggle__icon-moon"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M20.2 14.1A8.4 8.4 0 0 1 9.9 3.8a7.1 7.1 0 1 0 10.3 10.3Z"
						stroke="currentColor"
						strokeWidth="1.75"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
		</button>
	);
}

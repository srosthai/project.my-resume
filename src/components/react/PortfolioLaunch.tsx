import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import FlyingButton from './FlyingButton';

type Theme = 'dark' | 'light';

export default function PortfolioLaunch() {
	const [theme, setTheme] = useState<Theme>('dark');
	const [altitude, setAltitude] = useState(170);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const syncTheme = () => {
			setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
		};
		const syncAltitude = () => {
			setAltitude(Math.round(window.innerHeight));
		};
		setMounted(true);
		syncTheme();
		syncAltitude();
		const observer = new MutationObserver(syncTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		window.addEventListener('resize', syncAltitude);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', syncAltitude);
		};
	}, []);

	if (!mounted) return null;

	const light = theme === 'light';

	return createPortal(
		<div className="home-portfolio">
			<FlyingButton
				theme={theme}
				size="medium"
				altitude={altitude}
				hoverTime={2.4}
				jets={2}
				thrusters
				trigger="hover"
				carryCursor
				smoke={1}
				turbulence={1}
				wobble={1}
				ramp={false}
				thrustColor={light ? '#4f8cff' : '#8ec5ff'}
				smokeColor={light ? '#5c574f' : '#eef1f6'}
				onClick={() => {
					window.open('https://www.srosthai.me', '_blank', 'noopener,noreferrer');
				}}
			>
				Portfolio
			</FlyingButton>
		</div>,
		document.body
	);
}

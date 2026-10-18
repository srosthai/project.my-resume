import { useEffect, useState } from 'react';
import FlyingButton from './FlyingButton';

type Theme = 'dark' | 'light';

export default function PortfolioLaunch() {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		const sync = () => {
			setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
		};
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	}, []);

	return (
		<FlyingButton
			theme={theme}
			size="medium"
			altitude={170}
			hoverTime={2.4}
			jets={2}
			thrusters
			trigger="hover"
			carryCursor
			smoke={1}
			turbulence={1}
			wobble={1}
			ramp={false}
			thrustColor="#8ec5ff"
			smokeColor="#eef1f6"
			onClick={() => {
				window.open('https://www.srosthai.me', '_blank', 'noopener,noreferrer');
			}}
		>
			Portfolio
		</FlyingButton>
	);
}

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import rocket from '../../assets/rocket.png';
import FlyingButton from './FlyingButton';

type Theme = 'dark' | 'light';

const rocketFile = rocket as unknown as string | { src: string };
const rocketSrc = typeof rocketFile === 'string' ? rocketFile : rocketFile.src;

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
				thrusters={false}
				trigger="hover"
				carryCursor
				smoke={1}
				turbulence={1}
				wobble={1}
				ramp={false}
				thrustColor={light ? '#4f8cff' : '#8ec5ff'}
				smokeColor={light ? '#5c574f' : '#eef1f6'}
				buttonColor="transparent"
				onClick={() => {
					window.open('https://www.srosthai.me', '_blank', 'noopener,noreferrer');
				}}
			>
				<img className="rocket-mark" src={rocketSrc} alt="" draggable={false} />
				<span className="sr-only">Portfolio</span>
			</FlyingButton>
		</div>,
		document.body
	);
}

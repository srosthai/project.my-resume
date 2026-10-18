import Shuffle from './Shuffle';

export default function SiteBrand() {
	return (
		<a className="site-brand" href="/">
			<Shuffle
				text="SROS THAI"
				tag="span"
				className="site-brand__name shuffle-heading"
				textAlign="left"
				effect="slide"
				shuffleDirection="right"
				duration={0.35}
				animationMode="evenodd"
				shuffleTimes={1}
				ease="power3.out"
				stagger={0.03}
				threshold={0.1}
				triggerOnce
				triggerOnHover
				hoverRadius={0}
				motionBlur={false}
				respectReducedMotion
				maxDelay={0}
				scrambleCharset=""
				loop
				loopDelay={3}
				accentColor="var(--copper)"
			/>
			<span className="site-brand__role">Full Stack Developer</span>
		</a>
	);
}

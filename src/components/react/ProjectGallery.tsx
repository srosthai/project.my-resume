import { useEffect, useRef, useState } from 'react';
import CircularCarousel from './CircularCarousel';
import FlexCarousel, { type FlexCarouselItem } from './FlexCarousel';

export interface GalleryProject {
	slug: string;
	title: string;
	subtitle: string;
	cover: string;
	coverAlt: string;
}

interface ProjectGalleryProps {
	projects: GalleryProject[];
}

const MOBILE_QUERY = '(max-width: 767px)';

function openProject(projects: GalleryProject[], index: number) {
	const project = projects[index];
	if (project) window.location.assign(`/projects/${project.slug}`);
}

function fadeForTheme() {
	return document.documentElement.getAttribute('data-theme') === 'light' ? '#f4f1ea' : '#000000';
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
	const [mobile, setMobile] = useState<boolean | null>(null);
	const [active, setActive] = useState(0);
	const [fadeColor, setFadeColor] = useState('#000000');
	const activeRef = useRef(0);

	useEffect(() => {
		const media = window.matchMedia(MOBILE_QUERY);
		const sync = () => setMobile(media.matches);
		sync();
		media.addEventListener('change', sync);
		return () => media.removeEventListener('change', sync);
	}, []);

	useEffect(() => {
		const sync = () => setFadeColor(fadeForTheme());
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	}, []);

	const flexItems: FlexCarouselItem[] = projects.map((project) => ({
		src: project.cover,
		alt: project.coverAlt,
		title: project.title,
		subtitle: project.subtitle,
	}));

	const circularItems = projects.map((project) => ({
		src: project.cover,
		alt: project.coverAlt,
		title: project.title,
		subtitle: project.subtitle,
	}));

	if (!projects.length) {
		return <p className="project-gallery__empty">No projects yet.</p>;
	}

	const current = projects[active] ?? projects[0];

	return (
		<div className={`project-gallery${mobile ? ' project-gallery--mobile' : ''}`}>
			<div className="project-gallery__stage">
				{mobile === null ? null : mobile ? (
					<CircularCarousel
						items={circularItems}
						preset="cylinder"
						intro="rise"
						cardWidth={220}
						aspectRatio={1}
						speed={14}
						captions={false}
						gap={25}
						tilt={-5}
						curve={1}
						perspective={2500}
						autoplay="drift"
						interval={3}
						direction="left"
						momentum={0.6}
						snap
						pauseOnHover
						focusOnClick
						draggable
						parallax={0.3}
						stretch={0.5}
						fadeColor={fadeColor}
						depthFade={0.55}
						innerShade={0.6}
						cornerRadius={12}
						onChange={(index) => {
							activeRef.current = index;
							setActive(index);
						}}
						onItemClick={(_item, index) => {
							if (index === activeRef.current) openProject(projects, index);
						}}
					/>
				) : (
					<FlexCarousel
						items={flexItems}
						preset="liquid"
						intro="rise"
						cardHeight={0.5}
						gap={12}
						squeeze={0.2}
						focusOnClick
						captions
						fit="natural"
						radius={0}
						lensWidth={0.74}
						lensHeight={1.18}
						tilt={62}
						roundness={1}
						bend={0.34}
						reach={0.38}
						curl="twist"
						dispersion={0.45}
						liquid={0}
						followCursor={false}
						autoplay={false}
						interval={4}
						captureWheel
						onSelect={(index) => openProject(projects, index)}
					/>
				)}
			</div>
			{mobile && current && (
				<p className="project-gallery__caption">
					<span>{current.title}</span>
					<span>{current.subtitle}</span>
				</p>
			)}
		</div>
	);
}

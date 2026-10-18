import { useEffect, useState } from 'react';
import DepthCarousel from './DepthCarousel';
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

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
	const [mobile, setMobile] = useState<boolean | null>(null);
	const [active, setActive] = useState(0);

	useEffect(() => {
		const media = window.matchMedia(MOBILE_QUERY);
		const sync = () => setMobile(media.matches);
		sync();
		media.addEventListener('change', sync);
		return () => media.removeEventListener('change', sync);
	}, []);

	const flexItems: FlexCarouselItem[] = projects.map((project) => ({
		src: project.cover,
		alt: project.coverAlt,
		title: project.title,
		subtitle: project.subtitle,
	}));

	const depthItems = projects.map((project) => ({
		image: project.cover,
		alt: project.title,
	}));

	if (!projects.length) {
		return <p className="project-gallery__empty">No projects yet.</p>;
	}

	const current = projects[active] ?? projects[0];

	return (
		<div className={`project-gallery${mobile ? ' project-gallery--mobile' : ''}`}>
			<div className="project-gallery__stage">
				{mobile === null ? null : mobile ? (
					<DepthCarousel
						items={depthItems}
						depth={220}
						spread={90}
						tilt={22}
						tiltDirection="right"
						perspective={1400}
						visibleCards={4}
						falloff={0.2}
						blur={6}
						autoplay={false}
						loop
						cardWidth={300}
						cardHeight={380}
						radius={18}
						tint="#05060a"
						duration={700}
						ease="power3.out"
						autoplayDelay={3200}
						showControls
						showIndicators
						onChange={(index) => setActive(index)}
						onSelect={(index) => openProject(projects, index)}
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

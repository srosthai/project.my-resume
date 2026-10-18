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

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
	const items: FlexCarouselItem[] = projects.map((p) => ({
		src: p.cover,
		alt: p.coverAlt,
		title: p.title,
		subtitle: p.subtitle,
	}));

	if (!projects.length) {
		return <p className="project-gallery__empty">No projects yet.</p>;
	}

	return (
		<div className="project-gallery">
			<div className="project-gallery__stage">
				<FlexCarousel
					items={items}
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
					onSelect={(index) => {
						const project = projects[index];
						if (project) window.location.assign(`/projects/${project.slug}`);
					}}
				/>
			</div>
		</div>
	);
}

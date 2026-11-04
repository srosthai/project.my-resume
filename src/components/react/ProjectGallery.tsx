import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

export interface GalleryProject {
	slug: string;
	title: string;
	subtitle: string;
	summary: string;
	cover: string;
	coverAlt: string;
}

interface ProjectGalleryProps {
	projects: GalleryProject[];
}

const transitionName = (name: string) => ({ '--vt-name': name }) as CSSProperties;

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
	const [activeCategory, setActiveCategory] = useState('All');
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
	}, []);

	const categories = useMemo(() => {
		const unique = new Set(projects.map((project) => project.subtitle));
		return Array.from(unique);
	}, [projects]);

	const filteredProjects = useMemo(
		() =>
			activeCategory === 'All'
				? projects
				: projects.filter((project) => project.subtitle === activeCategory),
		[activeCategory, projects],
	);

	return (
		<div className="project-gallery" data-hydrated={hydrated ? '' : undefined}>
			<div className="project-filter" role="group" aria-label="Filter projects by category">
				<button
					type="button"
					className="filter-chip"
					aria-pressed={activeCategory === 'All'}
					onClick={() => setActiveCategory('All')}
				>
					<span>All</span>
					<span className="filter-chip__count" aria-hidden="true">
						{projects.length}
					</span>
				</button>
				{categories.map((category) => {
					const count = projects.filter((project) => project.subtitle === category).length;
					return (
						<button
							key={category}
							type="button"
							className="filter-chip"
							aria-pressed={activeCategory === category}
							onClick={() => setActiveCategory(category)}
						>
							<span>{category}</span>
							<span className="filter-chip__count" aria-hidden="true">
								{count}
							</span>
						</button>
					);
				})}
			</div>

			<p className="sr-only" aria-live="polite" aria-atomic="true">
				{filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} shown
			</p>

			{filteredProjects.length ? (
				<ul className="project-grid" aria-label="Projects">
					{filteredProjects.map((project, index) => (
						<li key={project.slug} className="project-grid__item">
							<a className="project-card" href={`/projects/${project.slug}/`}>
								<div className="project-card__media">
									<img
										className="project-card__cover"
										src={project.cover}
										alt={project.coverAlt}
										width={1600}
										height={900}
										loading={index < 3 ? 'eager' : 'lazy'}
										decoding="async"
										draggable={false}
										style={transitionName(`project-cover-${project.slug}`)}
									/>
								</div>
								<div className="project-card__body">
									<span className="project-card__pill">{project.subtitle}</span>
									<h2
										className="project-card__title"
										style={transitionName(`project-title-${project.slug}`)}
									>
										{project.title}
									</h2>
									<p className="project-card__summary">{project.summary}</p>
								</div>
							</a>
						</li>
					))}
				</ul>
			) : (
				<p className="project-grid__empty">No projects in this category.</p>
			)}
		</div>
	);
}

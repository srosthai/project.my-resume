import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { navigate } from 'astro:transitions/client';
import Folder from './Folder';

export interface GalleryProject {
	slug: string;
	title: string;
	subtitle: string;
	summary: string;
	cover: string;
	coverAlt: string;
	year: string;
}

interface FolderGalleryProps {
	projects: GalleryProject[];
}

const CATEGORY_ORDER = ['Full Stack', 'Frontend', 'Backend', 'Desktop App'];
const PREVIEW_LIMIT = 2;

const categoryId = (category: string) =>
	`category-${category
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')}`;

function useSiteTheme(): 'dark' | 'light' {
	const [theme, setTheme] = useState<'dark' | 'light'>('dark');

	useEffect(() => {
		const read = () => {
			setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
		};

		read();
		const observer = new MutationObserver(read);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

		return () => observer.disconnect();
	}, []);

	return theme;
}

/** Fit each folder inside its grid cell, from the phone layout up to the four-across row. */
function useFolderScale(): number {
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const update = () => {
			const width = window.innerWidth;
			const gutter = Math.min(Math.max(16, width * 0.04), 44);

			if (width >= 1080) {
				setScale(1);
				return;
			}

			const gap = width >= 560 ? 24 : 16;
			const deck = Math.min(width - gutter * 2, 680);
			const cell = (deck - gap) / 2;
			setScale(Math.max(0.52, Math.min(1.06, cell / 224)));
		};

		update();
		window.addEventListener('resize', update);

		return () => window.removeEventListener('resize', update);
	}, []);

	return scale;
}

function ProjectPaper({ project }: { project: GalleryProject }) {
	const coverStyle = { '--vt-name': `project-cover-${project.slug}` } as CSSProperties;
	const titleStyle = { '--vt-name': `project-title-${project.slug}` } as CSSProperties;

	return (
		<div className="folder-paper">
			<span className="folder-paper__media">
				<img
					className="folder-paper__cover"
					src={project.cover}
					alt=""
					loading="lazy"
					decoding="async"
					draggable={false}
					style={coverStyle}
				/>
			</span>
			<span className="folder-paper__title" style={titleStyle}>
				{project.title}
			</span>
			<span className="folder-paper__year">{project.year}</span>
			<span className="folder-paper__rule" aria-hidden="true" />
			<span className="folder-paper__rule folder-paper__rule--short" aria-hidden="true" />
			<span className="folder-paper__rule folder-paper__rule--footer" aria-hidden="true" />
		</div>
	);
}

export default function FolderGallery({ projects }: FolderGalleryProps) {
	const theme = useSiteTheme();
	const scale = useFolderScale();
	const [hydrated, setHydrated] = useState(false);
	const [openCategory, setOpenCategory] = useState<string | null>(null);

	useEffect(() => {
		setHydrated(true);
	}, []);

	const groups = useMemo(() => {
		const categories = Array.from(new Set(projects.map((project) => project.subtitle)));
		const ordered = [
			...CATEGORY_ORDER.filter((category) => categories.includes(category)),
			...categories.filter((category) => !CATEGORY_ORDER.includes(category)),
		];

		return ordered.map((category) => {
			const all = projects.filter((project) => project.subtitle === category);
			return {
				category,
				id: categoryId(category),
				all,
				preview: all.slice(0, PREVIEW_LIMIT),
			};
		});
	}, [projects]);

	const copper = theme === 'light' ? '#9a7d4f' : '#c4a574';

	return (
		<div className="folder-gallery" data-hydrated={hydrated ? '' : undefined}>
			<ul className="folder-deck" aria-label="Browse projects by category">
				{groups.map((group) => {
					const isOpen = openCategory === group.category;

					return (
						<li
							key={group.category}
							className="folder-group"
							data-active={isOpen ? '' : undefined}
						>
							<Folder
								label={group.category}
								mode="flap"
								variant="solid"
								color={copper}
								paperColor="#f8f3e9"
								tabPosition="center"
								layout="spread"
								size={scale}
								open={isOpen}
								onOpenChange={(open) => {
									setOpenCategory(open ? group.category : null);
								}}
								onItemClick={(_item, index) => {
									const project = group.preview[index];
									if (!project) return;
									void navigate(`/projects/${project.slug}/`);
								}}
								draggable={false}
								zoomOnClick={false}
								peek
								intro
								tilt={0.35}
								bounce={0.35}
								speed={1}
								theme={theme}
								closeOnOutsideClick
							>
								{group.preview.map((project) => (
									<ProjectPaper key={project.slug} project={project} />
								))}
							</Folder>

							<a
								className="folder-group__meta"
								href={`#${group.id}`}
								aria-label={`View all ${group.all.length} ${group.category} projects in the index`}
							>
								<span className="folder-group__label">{group.category}</span>
								<span className="folder-group__count" aria-hidden="true">
									{group.all.length}
								</span>
								<span className="folder-group__jump" aria-hidden="true">
									↓
								</span>
							</a>
						</li>
					);
				})}
			</ul>

			<section className="project-index" aria-labelledby="project-index-heading">
				<div className="project-index__head">
					<h2 id="project-index-heading">All projects</h2>
					<p>
						{projects.length} projects <span aria-hidden="true">/</span> {groups.length} disciplines
					</p>
				</div>

				<div className="project-index__grid">
					{groups.map((group) => (
						<section
							key={group.category}
							id={group.id}
							className="project-index__group"
							aria-labelledby={`${group.id}-heading`}
						>
							<div className="project-index__group-head">
								<h3 id={`${group.id}-heading`}>{group.category}</h3>
								<span>{group.all.length}</span>
							</div>
							<ul className="project-index__list">
								{group.all.map((project, index) => (
									<li key={project.slug}>
										<a href={`/projects/${project.slug}/`}>
											<span className="project-index__num" aria-hidden="true">
												{String(index + 1).padStart(2, '0')}
											</span>
											<span className="project-index__title">{project.title}</span>
											<span className="project-index__year">{project.year}</span>
										</a>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</section>
		</div>
	);
}

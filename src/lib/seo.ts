import type { Project } from '../data/projects';

export const FALLBACK_SITE_URL = 'https://projects.srosthai.me';
export const PERSON_NAME = 'SROS THAI';
export const PERSON_EMAIL = 'mailto:srosthai00@gmail.com';
export const HOME_TITLE = 'SROS THAI — Full Stack Developer Portfolio';
export const HOME_DESCRIPTION =
	'SROS THAI is a Full Stack Developer in Cambodia building web apps, Telegram mini apps, dashboards, and online stores. Explore selected projects.';
export const DEFAULT_OG_IMAGE = '/og-image.jpg';
export const DEFAULT_OG_IMAGE_ALT = 'SROS THAI, Full Stack Developer, portfolio preview';

export type JsonLd = Record<string, unknown>;

function absolute(site: URL, path: string): string {
	return new URL(path, site).href;
}

function personId(site: URL): string {
	return absolute(site, '/#person');
}

function websiteId(site: URL): string {
	return absolute(site, '/#website');
}

export function personSchema(site: URL): JsonLd {
	return {
		'@type': 'Person',
		'@id': personId(site),
		name: PERSON_NAME,
		alternateName: ['Sros Thai', 'srosthai'],
		description:
			'Full Stack Developer building web applications, Telegram mini apps, dashboards, and online stores from Cambodia.',
		url: absolute(site, '/'),
		image: absolute(site, '/me-1.png'),
		jobTitle: 'Full Stack Developer',
		email: PERSON_EMAIL,
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Phnom Penh',
			addressCountry: 'KH',
		},
		sameAs: [
			'https://github.com/srosthai',
			'https://www.linkedin.com/in/sros-thai-b491b42ab/',
		],
		knowsAbout: [
			'Laravel',
			'React',
			'Next.js',
			'TypeScript',
			'PHP',
			'MySQL',
			'Tailwind CSS',
			'Telegram Mini Apps',
		],
	};
}

export function websiteSchema(site: URL): JsonLd {
	return {
		'@type': 'WebSite',
		'@id': websiteId(site),
		url: absolute(site, '/'),
		name: PERSON_NAME,
		alternateName: ['srosthai', 'projects.srosthai.me'],
		description: HOME_DESCRIPTION,
		inLanguage: 'en',
		publisher: {
			'@id': personId(site),
		},
	};
}

export function homeGraph(
	site: URL,
	canonical: string,
	ogImage: string,
	projects: Project[],
): JsonLd[] {
	const person = personSchema(site);
	const website = websiteSchema(site);
	const itemList = {
		'@type': 'ItemList',
		'@id': `${canonical}#projects`,
		name: 'Selected work',
		numberOfItems: projects.length,
		itemListOrder: 'https://schema.org/ItemListOrderAscending',
		itemListElement: projects.map((project, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			url: absolute(site, `/projects/${project.slug}/`),
			name: project.title,
		})),
	};
	const profile = {
		'@type': 'ProfilePage',
		'@id': `${canonical}#profile`,
		url: canonical,
		name: HOME_TITLE,
		description: HOME_DESCRIPTION,
		inLanguage: 'en',
		isPartOf: { '@id': websiteId(site) },
		mainEntity: { '@id': personId(site) },
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: ogImage,
			width: 1200,
			height: 630,
		},
		hasPart: itemList,
	};

	return [person, website, profile];
}

export function projectGraph(
	site: URL,
	canonical: string,
	project: Project,
): JsonLd[] {
	const person = personSchema(site);
	const website = websiteSchema(site);
	const work = {
		'@type': 'CreativeWork',
		'@id': `${canonical}#project`,
		url: canonical,
		name: project.title,
		description: project.summary,
		image: absolute(site, project.cover),
		genre: project.subtitle,
		keywords: project.stack.join(', '),
		dateCreated: project.year,
		inLanguage: 'en',
		mainEntityOfPage: canonical,
		creator: { '@id': personId(site) },
		author: { '@id': personId(site) },
		isPartOf: { '@id': websiteId(site) },
	};
	const breadcrumb = {
		'@type': 'BreadcrumbList',
		'@id': `${canonical}#breadcrumb`,
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Projects',
				item: absolute(site, '/'),
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: project.title,
				item: canonical,
			},
		],
	};

	return [person, website, work, breadcrumb];
}

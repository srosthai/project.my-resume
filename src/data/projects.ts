export interface Project {
	slug: string;
	title: string;
	subtitle: string;
	summary: string;
	role: string;
	year: string;
	stack: string[];
	cover: string;
	coverAlt: string;
	body: string[];
	links: { label: string; href: string }[];
	/** Illustrative sample — replace with real case study content. */
	illustrative: true;
}

const photo = (id: string) =>
	`https://images.unsplash.com/${id}?w=1400&q=80&auto=format&fit=max`;

export const projects: Project[] = [
	{
		slug: 'signal-desk',
		title: 'Signal Desk',
		subtitle: 'Ops console',
		summary:
			'A focused operations console that turns noisy incident streams into a single actionable queue.',
		role: 'Product engineer',
		year: '2025',
		stack: ['TypeScript', 'React', 'Astro', 'PostgreSQL'],
		cover: photo('photo-1551288049-bebda4e38f71'),
		coverAlt: 'Dashboard charts on a dark workstation screen',
		body: [
			'Signal Desk grew from a need to stop context-switching across chat, tickets, and status pages during incidents.',
			'The work centered on a calm triage lane, keyboard-first navigation, and timelines that stay readable under pressure.',
			'Illustrative sample project for portfolio structure — swap in your real narrative, metrics, and outcomes.',
		],
		links: [{ label: 'Case notes', href: '#' }],
		illustrative: true,
	},
	{
		slug: 'folio-lens',
		title: 'Folio Lens',
		subtitle: 'Creative tool',
		summary: 'A lightweight review surface for creative teams to annotate stills without leaving the browser.',
		role: 'Full-stack engineer',
		year: '2024',
		stack: ['React', 'WebGL', 'Node', 'S3'],
		cover: photo('photo-1618005182384-a83a8bd57fbe'),
		coverAlt: 'Abstract iridescent 3D forms',
		body: [
			'Folio Lens treats image review as a spatial activity: frames stay large, comments stay anchored, and playback never fights the canvas.',
			'Built with progressive enhancement so teams can still leave written feedback when GPU features are unavailable.',
			'Illustrative sample project — replace cover art and copy with your shipped work.',
		],
		links: [{ label: 'Prototype', href: '#' }],
		illustrative: true,
	},
	{
		slug: 'harbor-route',
		title: 'Harbor Route',
		subtitle: 'Logistics',
		summary: 'Routing helpers that make last-mile planning legible for dispatchers on small screens.',
		role: 'Frontend lead',
		year: '2024',
		stack: ['Vue', 'MapLibre', 'Go'],
		cover: photo('photo-1524661139-891c36530825'),
		coverAlt: 'City map under soft evening light',
		body: [
			'Harbor Route prioritizes glanceable stops, conflict highlighting, and offline-tolerant map tiles for drivers between dead zones.',
			'The UI avoids dashboard clutter: one map, one list, and clear next actions.',
			'Illustrative sample project for layout and detail routing.',
		],
		links: [{ label: 'Design notes', href: '#' }],
		illustrative: true,
	},
	{
		slug: 'northline',
		title: 'Northline',
		subtitle: 'Brand site',
		summary: 'A marketing site rebuilt around performance budgets and editorial-quality type.',
		role: 'Web engineer',
		year: '2023',
		stack: ['Astro', 'CSS', 'Cloudflare'],
		cover: photo('photo-1497366216548-37526070297c'),
		coverAlt: 'Bright modern office interior',
		body: [
			'Northline traded a heavy SPA for Astro islands, cutting LCP while keeping one interactive configurator.',
			'Typography and spacing were treated as the brand system — not an afterthought layered on cards.',
			'Illustrative sample — substitute your live launch URL and results.',
		],
		links: [{ label: 'Live site', href: '#' }],
		illustrative: true,
	},
	{
		slug: 'pulse-kit',
		title: 'Pulse Kit',
		subtitle: 'Design system',
		summary: 'A token-driven component kit shared across internal tools with strict contrast defaults.',
		role: 'Design systems engineer',
		year: '2023',
		stack: ['React', 'Storybook', 'Tokens'],
		cover: photo('photo-1558655146-d09347e92766'),
		coverAlt: 'Colorful geometric design tools on a desk',
		body: [
			'Pulse Kit started as duplicated button styles and ended as documented tokens, themes, and accessibility checks in CI.',
			'Adoption hinged on migration guides and copy-paste recipes more than novelty components.',
			'Illustrative sample project.',
		],
		links: [{ label: 'Storybook', href: '#' }],
		illustrative: true,
	},
	{
		slug: 'atelier-feed',
		title: 'Atelier Feed',
		subtitle: 'Community',
		summary: 'A quiet reading feed for a small creative community — less infinite scroll, more intentional posts.',
		role: 'Indie builder',
		year: '2022',
		stack: ['SvelteKit', 'SQLite', 'Tailwind'],
		cover: photo('photo-1455390582262-044cdead277a'),
		coverAlt: 'Notebook and pen on a wooden table',
		body: [
			'Atelier Feed capped velocity on purpose: daily digests, editorial tags, and a writing surface that feels like paper.',
			'The product bet was that fewer, better posts would keep the room alive longer than a noisy stream.',
			'Illustrative sample project.',
		],
		links: [{ label: 'Archive', href: '#' }],
		illustrative: true,
	},
];

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
	return projects.map((p) => p.slug);
}

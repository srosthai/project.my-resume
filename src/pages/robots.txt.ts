import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
	const base = site ?? new URL('https://projects.srosthai.me');
	const sitemap = new URL('/sitemap.xml', base).href;
	const body = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};

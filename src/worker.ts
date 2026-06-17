import handler from "@astrojs/cloudflare/entrypoints/server";

export { PluginBridge } from "@emdash-cms/cloudflare/sandbox";

export default {
	async fetch(request: Request, env: any, ctx: any) {
		const response = await handler.fetch(request, env, ctx);
		const secureResponse = new Response(response.body, response);

		// Prevent Clickjacking
		secureResponse.headers.set("X-Frame-Options", "DENY");

		// Prevent MIME-sniffing
		secureResponse.headers.set("X-Content-Type-Options", "nosniff");

		// Enforce HTTPS
		secureResponse.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

		// Control Referrer Information
		secureResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

		// Implement a Strict Content Security Policy (CSP)
		secureResponse.headers.set(
			"Content-Security-Policy",
			"default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://cloudflareinsights.com;",
		);

		return secureResponse;
	},
};

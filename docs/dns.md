# DNS cutover

Six custom domains currently resolve to the Webflow site:

- `ngobrandon.com` / `www.ngobrandon.com`
- `brandon.ngo` / `www.brandon.ngo`
- `brandonngo.design` / `www.brandonngo.design`

Until one is chosen, the app treats `https://ngobrandon.com` as canonical via `siteConfig.url` and `metadataBase`.

## Sequence

1. Deploy this Next.js app to Vercel and confirm the preview looks right.
2. In Vercel, add all six hostnames to the project.
3. Pick one canonical domain. Add 308 redirects from the other five to it in the Vercel domain settings (not in Next.js), so they work at the edge for every hostname.
4. Keep Webflow live. Point the canonical domain's DNS at Vercel first (A / ALIAS / CNAME per Vercel instructions).
5. Verify HTTPS, redirects, and that `/studio` is reachable only if you want it public — otherwise protect it.
6. Switch the remaining five domains.
7. Only then unpublish or archive the Webflow site.

Do not cut DNS until a Vercel production deploy is verified. Webflow remains the live site until that moment.

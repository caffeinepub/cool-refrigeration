# Cool Refrigeration

## Current State
Security headers exist only as `<meta http-equiv>` tags in index.html. These are browser hints only — they are NOT enforced as real HTTP response headers at the server level. The .ic-assets.json5 config for the ICP asset canister does not exist yet.

## Requested Changes (Diff)

### Add
- `.ic-assets.json5` in `src/frontend/public/` to set real HTTP response headers via the ICP asset canister for ALL served files
- HSTS (Strict-Transport-Security) with max-age=31536000, includeSubDomains, preload — forces HTTPS always, strongest protection against DNS hijacking and SSL stripping
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Resource-Policy: same-origin
- Referrer-Policy: strict-origin-when-cross-origin (server-level, not just meta)
- X-DNS-Prefetch-Control: off (server-level)
- X-Content-Type-Options: nosniff (server-level)
- X-Frame-Options: SAMEORIGIN (server-level)
- Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=() (server-level)

### Modify
- `index.html`: Strengthen CSP to add `upgrade-insecure-requests` directive and add `form-action 'self'` to block form submissions to external domains

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/public/.ic-assets.json5` with full security header config
2. Update `index.html` CSP meta tag to include `upgrade-insecure-requests` and `form-action 'self'`

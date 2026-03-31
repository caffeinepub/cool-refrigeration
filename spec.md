# Cool Refrigeration - Security Hardening

## Current State
- Basic CSP in index.html (unsafe-eval, unsafe-inline present)
- Simple honeypot + rate limiting on forms
- Basic sanitizeInput (HTML entity encoding)
- Admin panel at #admin, no auth
- Email address exposed as plain text in HTML
- No additional security headers beyond CSP
- No visible trust/security indicators for customers

## Requested Changes (Diff)

### Add
- Stronger Content Security Policy: remove `unsafe-eval`, tighten script-src
- Additional meta security headers: X-Frame-Options SAMEONLY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (disable camera/mic/geolocation unless needed)
- Email obfuscation: encode coolrefrigeration318@gmail.com as HTML entities / split string in JS to prevent bot scraping
- Enhanced sanitizeInput: handle additional XSS vectors (javascript:, data: URIs, event handlers)
- Improved rate limiting: track submission attempts count, block after 3 rapid attempts, show countdown timer to user
- CSRF token simulation: generate a session token in memory, validate on form submit
- Encrypted localStorage: encode stored order/review data with base64+rotation cipher so raw data isn't plaintext in browser storage
- Security Trust Badge section: visible HTTPS/encryption badge near footer or order form, reassuring customers
- Input pattern validation: add regex patterns for email format, phone number format (10 digits Indian number), prevent script injection
- DNS Prefetch Control: add X-DNS-Prefetch-Control off meta tag
- Security status indicator in admin panel: show security stats (blocked bots, total submissions)

### Modify
- index.html: strengthen CSP meta tag (remove unsafe-eval), add all security meta tags
- sanitizeInput function: extend to strip dangerous protocols and patterns
- Rate limit function: track attempt counts, not just timestamps
- Admin panel: add security stats tab showing blocked attempts

### Remove
- `unsafe-eval` from CSP script-src
- `frame-src https://www.youtube.com` from CSP (video section was removed)

## Implementation Plan
1. Update index.html with hardened security headers and stronger CSP
2. Enhance sanitizeInput utility to cover more attack vectors
3. Upgrade rate limiting to count-based blocking with UI feedback
4. Add CSRF token generation/validation pattern
5. Add email obfuscation throughout the app
6. Encrypt localStorage writes/reads for orders and reviews data
7. Add a Security Trust Badge component near the order/payment section
8. Add input pattern validation attributes and JS validation on forms
9. Add security stats panel in admin view
10. Add DNS prefetch control and permissions policy meta tags

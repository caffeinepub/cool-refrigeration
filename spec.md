# Cool Refrigeration - Security & Admin Panel

## Current State
- Pure frontend app (React/TypeScript)
- Backend is empty (`actor {}`)
- Orders are sent via WhatsApp only (not stored)
- Reviews stored in React component state only (not persisted)
- No spam protection, no input sanitization, no admin access

## Requested Changes (Diff)

### Add
- Honeypot hidden fields on order form and review form to block bots
- Rate limiting on form submissions (max 1 submission per 60 seconds per form, tracked via localStorage)
- Input sanitization utility to strip HTML/script tags from all text inputs before use
- Content Security Policy (CSP) meta tag in index.html
- Password-protected admin panel at `/admin` route:
  - Login screen with password field (default password: `CoolRefrig@2024`)
  - Dashboard showing: all submitted reviews with name, rating, message, timestamp
  - Dashboard showing: all logged order inquiries with name, phone, email, service, address, date, notes
  - Logout button
- Backend Motoko actor to persist reviews and order logs
- Admin password verification in backend

### Modify
- Order form: add honeypot field, rate limiting, input sanitization; also log the order to backend (in addition to WhatsApp)
- Review form: add honeypot field, rate limiting, input sanitization; save reviews to backend instead of just local state
- index.html: add CSP meta tag
- App.tsx: add `/admin` route handling

### Remove
- Nothing removed

## Implementation Plan
1. Generate Motoko backend with:
   - `submitReview(name, rating, message)` - store review with timestamp
   - `getReviews()` - return all reviews (admin only)
   - `logOrder(name, phone, email, service, productInterest, address, preferredDate, notes)` - store order inquiry
   - `getOrders()` - return all orders (admin only)
   - `verifyAdminPassword(password)` - check against hardcoded hash
2. Update frontend:
   - Add `sanitizeInput()` utility function
   - Add honeypot fields (hidden, named `website` or `url`) to both forms
   - Add rate limiting logic using localStorage timestamps
   - Add CSP meta tag to index.html
   - Add admin panel component with login + dashboard
   - Wire review form to backend `submitReview`
   - Wire order form to also call `logOrder` in backend
   - Admin panel calls `getReviews()` and `getOrders()` after password verification

# Cool Refrigeration

## Current State
The site has an AdminPanel component accessible at `#admin`. It fetches orders and reviews from the backend (`actor.getAllOrders()`, `actor.getAllReviews()`) and displays orders in a table. The table shows: Date/Time, Name, Phone, Email, Service, Product, Address, Notes. The `preferred_date` field exists in the `AdminOrder` type but is NOT rendered in the table. There are no quick-action buttons to contact customers. The reviews tab shows cards with star ratings.

## Requested Changes (Diff)

### Add
- `Preferred Date` column to the orders table
- Quick action buttons per order row: "Call" (tel: link) and "WhatsApp" (wa.me link with customer name and service pre-filled)
- "Refresh" button in the admin header to reload orders/reviews without page reload
- Order count badge visible at a glance

### Modify
- Orders table to include `preferred_date` column (currently missing despite being in the type)
- Table layout to be more readable on mobile (horizontal scroll already works, keep it)
- Each order row should have a subtle highlight for new/recent orders (within last 24h)

### Remove
- Nothing

## Implementation Plan
1. Add `preferred_date` column between Address and Notes in the orders table
2. Add two action buttons per row: `📞 Call` (opens `tel:+91XXXXXXXXXX`) and `💬 WhatsApp` (opens `https://wa.me/91{phone}?text=...` with customer name and service type)
3. Add a Refresh button in the admin dashboard header that re-calls `actor.getAllOrders()` and `actor.getAllReviews()`
4. Highlight rows where `timestamp` is within the last 24 hours with a subtle cyan left border

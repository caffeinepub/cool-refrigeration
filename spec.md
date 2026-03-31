# Cool Refrigeration

## Current State
Full-featured refrigeration services website with hero, services, products, testimonials, orders, payments, contact, about page, admin panel, cart, and customer reviews. Dark theme with cyan accents and glass-card effects. Security trust badge exists above the order form.

## Requested Changes (Diff)

### Add
- `ShieldNet` component: an animated SVG/CSS shield with hexagonal mesh network pattern, glowing cyan, with the label "Shield Net Protection Active". Placed in the hero section on the right side (desktop) as a floating visual element. On mobile it can be shown as a small centered element below hero stats.
- Animated pulsing shield SVG with hex/honeycomb mesh lines radiating outward (net-like pattern)
- Network nodes (small circles) connected by lines inside/around the shield

### Modify
- Hero section: add the `ShieldNet` animated component to the right side of the hero on desktop (lg:flex two-column layout — text left, shield right)

### Remove
- Nothing removed

## Implementation Plan
1. Create `ShieldNetAnimation` component using inline SVG + CSS animations (no external dependencies)
   - Large shield shape (SVG path) with cyan glow effect
   - Hexagonal/honeycomb mesh pattern inside the shield as SVG pattern
   - Animated concentric pulse rings around the shield
   - Floating network nodes (dots) connected by faint lines
   - Label: "SHIELD NET" in uppercase cyan, "Protection Active" subtext with green dot
2. Update Hero section layout to be two-column on large screens: left = existing text content, right = ShieldNetAnimation
3. Add CSS keyframe animations (rotate-slow, pulse-ring, float-node) in index.css or as inline styles

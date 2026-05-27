---
name: Cabinet breakpoints
description: Correct Tailwind breakpoints for Cabinet layout elements (sidebar, tabbar, mobile strip)
---

In Cabinet.tsx the layout breakpoint is **md (768px)**, not lg (1024px).

- Mobile profile strip: `md:hidden`
- Sidebar: `hidden md:flex md:flex-col md:w-72`
- Bottom tabbar: `md:hidden`
- Main content top padding: `md:pt-24 md:pb-16`
- Main flex row: `md:flex-row`

**Why:** The original code used `lg:` everywhere but that caused the sidebar to appear too late (only at 1024px) and the mobile strip/tabbar to persist on tablet. The breakpoint was intentionally moved to md during the session-2 regression fix (B.2).

**How to apply:** Any new layout element that should switch between mobile and desktop mode should use `md:` as the threshold.

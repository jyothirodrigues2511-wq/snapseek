# SnapSeek

SnapSeek turns any word into a wall of pictures — type a topic, hit Search, and images flow into a responsive gallery. Part 1 ships the full interface: a sticky brand header, an accessible search form, quick-pick topic chips, a warm espresso-and-amber light/dark theme, and an empty card grid waiting for real results.

Design decisions:

1. I chose `repeat(auto-fill, minmax(220px, 1fr))` so the grid re-flows from one column on phones to five or more on widescreen, with zero media-query bookkeeping per card. The cards themselves only appear in Part 2.
2. The hero is a two-column stage — search on the left, a pure-CSS collage of dashed "open frames" on the right — so the page reads as a gallery even before a single image exists, and the whole look is driven by CSS custom properties so theming never touches markup.
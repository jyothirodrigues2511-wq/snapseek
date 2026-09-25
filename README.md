# SnapSeek

SnapSeek turns any word into a wall of pictures — type a topic, hit Search, and the app fetches live images from the Wikimedia Commons API (key-free, CORS-enabled) and re-flows them into a responsive gallery. Part 2 wires the search: submit the form or tap a quick-pick chip and real result cards render into the grid, complete with captions and credits; blank searches are ignored and the Clear control resets the wall.

Design decisions:

1. I chose `repeat(auto-fill, minmax(220px, 1fr))` so the grid re-flows from one column on phones to five or more on widescreen, with zero media-query bookkeeping per card.
2. The hero is a two-column stage — search on the left, a pure-CSS collage of dashed "open frames" on the right — so the page reads as a gallery even before a single image exists, and the whole look is driven by CSS custom properties so theming never touches markup.
3. Result cards are clickable links that open the image's Commons file page in a new tab, and each card shows the contributing artist alongside the caption for a touch of provenance.
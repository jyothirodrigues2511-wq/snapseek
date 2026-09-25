// SnapSeek — Part 2.
// Catches the search, fetches matching images from the Wikimedia Commons API
// (no key required) and renders each result as a card in the grid.

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
const resultCountValue = document.getElementById('resultCountValue');
const resultCountQuery = document.getElementById('resultCountQuery');
const emptyState = document.getElementById('emptyState');

const RESULTS_PER_SEARCH = 18;

function buildApiUrl(query) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: 6,
    gsrlimit: String(RESULTS_PER_SEARCH),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '500'
  });
  return 'https://commons.wikimedia.org/w/api.php?' + params.toString();
}

async function searchImages(query) {
  const trimmed = query.trim();
  if (!trimmed) return;

  const response = await fetch(buildApiUrl(trimmed));
  if (!response.ok) {
    throw new Error('Request failed: ' + response.status);
  }
  const data = await response.json();
  const pages = Object.values(data.query?.pages || {});
  renderResults(pages, trimmed);
}

function renderResults(pages, query) {
  resultsGrid.innerHTML = '';
  emptyState.classList.add('is-hidden');

  let rendered = 0;
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info?.url) continue;

    const card = document.createElement('li');
    card.className = 'card';
    card.dataset.pageId = String(page.pageid || '');

    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = info.descriptionurl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const image = document.createElement('img');
    image.className = 'card-media';
    image.src = info.thumburl || info.url;
    image.alt = page.title.replace(/^File:/, '');
    image.loading = 'lazy';
    image.decoding = 'async';

    const caption = document.createElement('div');
    caption.className = 'card-caption';

    const title = document.createElement('p');
    title.className = 'card-title';
    title.textContent = page.title.replace(/^File:/, '');

    const artist = artistName(info.extmetadata?.Artist?.value);
    const author = document.createElement('p');
    author.className = 'card-author';
    author.textContent = artist ? 'by ' + artist : 'Wikimedia Commons contributor';

    caption.append(title, author);
    link.append(image, caption);
    card.appendChild(link);
    resultsGrid.appendChild(card);
    rendered += 1;
  }

  resultCountValue.textContent = String(rendered);
  resultCountQuery.textContent = rendered > 0 ? ' for "' + query + '"' : '';
  searchInput.value = query;
}

function artistName(html) {
  if (!html) return '';
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.textContent.trim().replace(/\s+/g, ' ');
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchImages(searchInput.value).catch(() => {
    resultsGrid.innerHTML = '';
    resultCountValue.textContent = '0';
    resultCountQuery.textContent = '';
  });
});

searchForm.addEventListener('reset', () => {
  resultsGrid.innerHTML = '';
  resultCountValue.textContent = '0';
  resultCountQuery.textContent = '';
  emptyState.classList.remove('is-hidden');
  searchInput.focus();
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    searchInput.value = chip.dataset.query;
    searchImages(chip.dataset.query).catch((error) => console.error(error));
  });
});
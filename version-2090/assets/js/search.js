(function () {
  const input = document.getElementById('global-search-input');
  const results = document.getElementById('search-results');
  const form = input ? input.closest('form') : null;
  const list = Array.isArray(window.SITE_MOVIE_INDEX) ? window.SITE_MOVIE_INDEX : (typeof SITE_MOVIE_INDEX !== 'undefined' ? SITE_MOVIE_INDEX : []);

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';

  const createCard = function (movie) {
    const tags = Array.isArray(movie.tags) ? movie.tags.slice(0, 3) : [];
    return `
      <article class="movie-card">
        <a class="card-poster" href="${movie.url}" style="background-image: linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.86)), url('${movie.image}');" aria-label="${escapeHtml(movie.title)}">
          <span class="duration-badge">${escapeHtml(movie.duration)}</span>
        </a>
        <div class="card-body">
          <div class="card-meta">
            <span>${escapeHtml(movie.year)}</span>
            <span>${escapeHtml(movie.region)}</span>
          </div>
          <h3><a href="${movie.url}">${escapeHtml(movie.title)}</a></h3>
          <p>${escapeHtml(movie.oneLine)}</p>
          <div class="mini-tags">${tags.map(function (tag) { return `<span>${escapeHtml(tag)}</span>`; }).join('')}</div>
        </div>
      </article>`;
  };

  const escapeHtml = function (value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const render = function (query) {
    const text = String(query || '').trim().toLowerCase();
    let matches = list;

    if (text) {
      matches = list.filter(function (movie) {
        const haystack = [movie.title, movie.year, movie.region, movie.genre, movie.category, movie.oneLine, (movie.tags || []).join(' ')].join(' ').toLowerCase();
        return haystack.includes(text);
      });
    }

    results.innerHTML = matches.slice(0, 80).map(createCard).join('');
  };

  if (input && results) {
    input.value = initialQuery;
    render(initialQuery);

    input.addEventListener('input', function () {
      render(input.value);
    });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render(input.value);
    });
  }
})();

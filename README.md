# pietrotraversa.github.io

## Preview the website locally

The publication list is loaded from JSON, so the site must be viewed through a
local web server rather than by double-clicking `index.html`.

From the repository folder, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Stop the server with <kbd>Control</kbd> +
<kbd>C</kbd>.

## Refresh citation counts locally

The GitHub repository secret is available only to GitHub Actions. For local use,
copy `.env.example` to `.env` and replace the placeholder with the Semantic
Scholar API key. `.env` is ignored by Git and must not be committed.

Then run:

```sh
python3 tools/update_citations.py
```

Reload the local website to see the cached citation counts.

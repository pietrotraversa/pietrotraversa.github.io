#!/usr/bin/env python3
"""Refresh cached citation counts using the Semantic Scholar Graph API."""

from __future__ import annotations

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
PUBLICATIONS_FILE = ROOT / "publications" / "publications.json"
API_URL = "https://api.semanticscholar.org/graph/v1/paper/batch"
FIELDS = "paperId,title,citationCount,url"
MAX_ATTEMPTS = 5


def get_api_key() -> str:
    """Read the key from the environment or from an ignored local .env file."""
    api_key = os.environ.get("SEMANTIC_SCHOLAR_API_KEY", "").strip()
    if api_key:
        return api_key

    env_file = ROOT / ".env"
    if not env_file.exists():
        return ""

    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        if name.strip() == "SEMANTIC_SCHOLAR_API_KEY":
            return value.strip().strip('"\'')
    return ""


def fetch_papers(ids: list[str]) -> list[dict | None]:
    request = Request(
        f"{API_URL}?{urlencode({'fields': FIELDS})}",
        data=json.dumps({"ids": ids}).encode("utf-8"),
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "pietrotraversa.github.io citation updater",
        },
        method="POST",
    )

    api_key = get_api_key()
    if api_key:
        request.add_header("x-api-key", api_key)
    else:
        print(
            "No local Semantic Scholar API key found; using the shared unauthenticated limit.",
            file=sys.stderr,
        )

    for attempt in range(MAX_ATTEMPTS):
        try:
            with urlopen(request, timeout=30) as response:
                return json.load(response)
        except HTTPError as error:
            if error.code != 429 and error.code < 500:
                raise
            retry_after = error.headers.get("Retry-After")
            requested_delay = int(retry_after) if retry_after and retry_after.isdigit() else 2**attempt
            delay = min(requested_delay, 30)
        except URLError:
            delay = 2**attempt

        if attempt < MAX_ATTEMPTS - 1:
            time.sleep(delay)

    raise RuntimeError("Semantic Scholar remained unavailable after several attempts")


def main() -> int:
    data = json.loads(PUBLICATIONS_FILE.read_text(encoding="utf-8"))
    publications = data.get("publications", [])
    ids = [publication["semanticScholarId"] for publication in publications]
    papers = fetch_papers(ids)

    if len(papers) != len(publications):
        raise RuntimeError("Semantic Scholar returned an unexpected number of records")

    missing = []
    for publication, paper in zip(publications, papers):
        if paper is None:
            missing.append(publication["title"])
            continue

        publication["citationCount"] = paper["citationCount"]
        publication["semanticScholarPaperId"] = paper["paperId"]
        publication["semanticScholarUrl"] = paper["url"]

    data["citationCountsUpdatedAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    PUBLICATIONS_FILE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    if missing:
        print("No Semantic Scholar match for: " + "; ".join(missing), file=sys.stderr)
    print(f"Updated citation counts for {len(publications) - len(missing)} publications.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

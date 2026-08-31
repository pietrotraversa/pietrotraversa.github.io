"use strict";

const publicationList = document.getElementById("publicationList");
const publicationSortButton = document.getElementById("publicationSortButton");
const publicationSortLabel = document.getElementById("publicationSortLabel");
const publicationSortStatus = document.getElementById("publicationSortStatus");
let publications = [];
let sortDirection = "newest";

function comparePublicationDates(first, second) {
  return first.publicationDate.localeCompare(second.publicationDate);
}

function createPublicationItem(publication) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const title = document.createElement("span");
  const authors = document.createElement("span");
  const citation = document.createElement("span");
  const citationCount = document.createElement("span");

  link.className = "publication-link";
  link.href = publication.detailUrl;

  title.className = "publication-title";
  title.textContent = publication.title;

  authors.className = "publication-authors";
  authors.textContent = publication.authors.join(", ");

  citation.className = "publication-journal";
  citation.textContent = publication.citation;

  link.append(title, authors, citation);

  if (Number.isInteger(publication.citationCount)) {
    citationCount.className = "publication-citation-count";
    citationCount.textContent = `${publication.citationCount.toLocaleString()} ${publication.citationCount === 1 ? "citation" : "citations"} on Semantic Scholar`;
    link.append(citationCount);
  }

  item.append(link);
  return item;
}

function renderPublications() {
  const sortedPublications = [...publications].sort(comparePublicationDates);

  if (sortDirection === "newest") {
    sortedPublications.reverse();
  }

  publicationList.replaceChildren(...sortedPublications.map(createPublicationItem));
  publicationList.setAttribute("aria-busy", "false");

  const currentOrder = sortDirection === "newest" ? "newest first" : "oldest first";
  const nextOrder = sortDirection === "newest" ? "oldest first" : "newest first";
  publicationSortLabel.textContent = `Show ${nextOrder}`;
  publicationSortStatus.textContent = `Publications sorted ${currentOrder}.`;
}

function showPublicationError() {
  const errorItem = document.createElement("li");
  errorItem.className = "publication-error";
  errorItem.textContent = window.location.protocol === "file:"
    ? "The publication list needs a local web server. Run python3 -m http.server 8000 in the website folder, then open http://localhost:8000/."
    : "The publication list could not be loaded. Please try again later.";
  publicationList.replaceChildren(errorItem);
  publicationList.setAttribute("aria-busy", "false");
  publicationSortButton.hidden = true;
}

publicationSortButton.addEventListener("click", () => {
  sortDirection = sortDirection === "newest" ? "oldest" : "newest";
  renderPublications();
});

fetch("./publications/publications.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Publication data request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (!Array.isArray(data.publications)) {
      throw new TypeError("Publication data is missing its publications array");
    }

    publications = data.publications;
    publicationSortButton.hidden = false;
    renderPublications();
  })
  .catch((error) => {
    console.error(error);
    showPublicationError();
  });

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#property-search");
const filterForm = document.querySelector("#listing-filters");
const filterAddress = document.querySelector("#filter-address");
const listings = Array.from(document.querySelectorAll(".listing"));
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getCheckedValues = (name) =>
  Array.from(filterForm.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => normalize(input.value));

const getSelectValue = (name) => normalize(filterForm.elements[name]?.value || "");

const matchesAny = (listing, key, selectedValues) => {
  if (!selectedValues.length) return true;
  const value = normalize(listing.dataset[key] || "");
  return selectedValues.some((selected) => value.includes(selected));
};

function filterListings() {
  const query = normalize(filterAddress.value);
  const province = getSelectValue("province");
  const city = getSelectValue("city");
  const operation = getCheckedValues("operation");
  const property = getCheckedValues("property");
  const zone = getCheckedValues("zone");
  const condition = getCheckedValues("condition");
  const location = getCheckedValues("location");
  const purpose = getCheckedValues("purpose");
  let visibleCount = 0;

  listings.forEach((listing) => {
    const haystack = normalize(listing.dataset.search || listing.textContent);
    const isVisible =
      (!query || haystack.includes(query)) &&
      (!province || normalize(listing.dataset.province || "") === province) &&
      (!city || normalize(listing.dataset.city || "") === city) &&
      matchesAny(listing, "operation", operation) &&
      matchesAny(listing, "property", property) &&
      matchesAny(listing, "zone", zone) &&
      matchesAny(listing, "condition", condition) &&
      matchesAny(listing, "location", location) &&
      matchesAny(listing, "purpose", purpose);

    listing.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
  resultCount.textContent = visibleCount;
}

filterForm.addEventListener("input", filterListings);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterAddress.value = searchInput.value;
  filterListings();
  document.querySelector("#destacados").scrollIntoView({ behavior: "smooth", block: "start" });
});

filterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterListings();
});

filterForm.addEventListener("reset", () => {
  window.setTimeout(filterListings, 0);
});

filterListings();

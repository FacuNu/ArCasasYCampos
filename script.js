const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
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

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    const params = query ? `?search=${encodeURIComponent(query)}` : "";
    window.location.href = `inmuebles.html${params}`;
  });
}

if (filterForm && filterAddress) {
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

    if (emptyState) emptyState.hidden = visibleCount > 0;
    if (resultCount) resultCount.textContent = visibleCount;
  }

  const params = new URLSearchParams(window.location.search);
  const initialSearch = params.get("search");
  if (initialSearch) filterAddress.value = initialSearch;

  filterForm.addEventListener("input", filterListings);

  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterListings();
  });

  filterForm.addEventListener("reset", () => {
    window.setTimeout(filterListings, 0);
  });

  filterListings();
}

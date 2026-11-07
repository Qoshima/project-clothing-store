document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const products = window.TamyrProducts || [];
  const favoritesKey = "tamyr-favorites-v1";
  const cartKey = "tamyr-cart-v1";

  const searchInput = document.getElementById("catalog-search");
  const categorySelect = document.getElementById("catalog-category");
  const sortSelect = document.getElementById("catalog-sort");
  const onlyFavorites = document.getElementById("favorites-only");
  const resetButton = document.getElementById("reset-filters");
  const resultsCount = document.getElementById("results-count");
  const feedback = document.getElementById("catalog-feedback");
  const cartCount = document.getElementById("cart-count");
  const gridWomen = document.getElementById("women-products");
  const gridMen = document.getElementById("men-products");

  if (!searchInput || !categorySelect || !sortSelect || !onlyFavorites ||
      !resetButton || !resultsCount || !feedback || !gridWomen || !gridMen) {
    return;
  }

  function readSavedArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function saveArray(key, array) {
    try {
      localStorage.setItem(key, JSON.stringify(array));
      return true;
    } catch (error) {
      feedback.textContent = "Browser storage is unavailable. Changes cannot be saved.";
      return false;
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(price) + " tenge";
  }

  function getFilteredProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;
    const favorites = readSavedArray(favoritesKey);

    const matching = products.filter(function (product) {
      const matchesName = (product.name + " " + product.color).toLowerCase().includes(query);
      const matchesCategory = selectedCategory === "all" ||
        product.category === selectedCategory ||
        (selectedCategory === "new" && product.isNew);
      const matchesFavorites = !onlyFavorites.checked || favorites.includes(product.id);
      return matchesName && matchesCategory && matchesFavorites;
    });

    if (sortSelect.value === "price-low") {
      matching.sort(function (a, b) { return a.price - b.price; });
    } else if (sortSelect.value === "price-high") {
      matching.sort(function (a, b) { return b.price - a.price; });
    } else if (sortSelect.value === "name") {
      matching.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    return matching;
  }

  function createProductCard(product) {
    const column = document.createElement("div");
    column.className = "col-12 col-sm-6 col-lg-4";

    const card = document.createElement("article");
    card.className = "product-card";

    const imageBox = document.createElement("div");
    imageBox.className = "product-image";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name + " — " + product.color;
    image.width = 600;
    image.height = 800;
    image.loading = "lazy";
    imageBox.appendChild(image);

    if (product.isNew) {
      const badge = document.createElement("span");
      badge.className = "product-badge";
      badge.textContent = "New";
      imageBox.appendChild(badge);
    }

    const info = document.createElement("div");
    info.className = "product-info";
    const title = document.createElement("h3");
    title.textContent = product.name;
    const details = document.createElement("p");
    details.className = "product-details";
    details.textContent = product.color + " · " + product.sizes;
    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const saved = readSavedArray(favoritesKey).includes(product.id);
    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "product-action favorite-button";
    favoriteButton.dataset.action = "favorite";
    favoriteButton.dataset.id = product.id;
    favoriteButton.textContent = saved ? "♥ Saved" : "♡ Save";
    favoriteButton.setAttribute("aria-pressed", String(saved));
    favoriteButton.setAttribute("aria-label", saved ?
      "Remove " + product.name + " from favorites" :
      "Save " + product.name + " to favorites");

    const cartButton = document.createElement("button");
    cartButton.type = "button";
    cartButton.className = "product-action add-button";
    cartButton.dataset.action = "cart";
    cartButton.dataset.id = product.id;
    cartButton.textContent = "Add to bag";
    cartButton.setAttribute("aria-label", "Add " + product.name + " to bag");

    actions.append(favoriteButton, cartButton);
    info.append(title, details, price, actions);
    card.append(imageBox, info);
    column.appendChild(card);
    return column;
  }

  function renderProducts() {
    const shown = getFilteredProducts();
    const groups = [
      { category: "women", grid: gridWomen },
      { category: "men", grid: gridMen }
    ];

    for (const group of groups) {
      const inGroup = shown.filter(function (item) { return item.category === group.category; });
      const fragment = document.createDocumentFragment();

      inGroup.forEach(function (item) { fragment.appendChild(createProductCard(item)); });

      if (inGroup.length === 0) {
        const empty = document.createElement("p");
        empty.className = "catalog-empty";
        empty.textContent = "No matching products here.";
        fragment.appendChild(empty);
      }
      group.grid.replaceChildren(fragment);
      const count = document.querySelector("#" + group.category + " .collection-count");
      if (count) count.textContent = inGroup.length + (inGroup.length === 1 ? " piece" : " pieces");
    }

    resultsCount.textContent = shown.length + (shown.length === 1 ? " product found" : " products found");
    updateCartCounter();
  }

  function updateCartCounter() {
    if (!cartCount) return;
    const cart = readSavedArray(cartKey);
    let quantity = 0;
    for (const item of cart) {
      if (Number.isInteger(item.quantity) && item.quantity > 0) quantity += item.quantity;
    }
    cartCount.textContent = String(quantity);
    cartCount.hidden = quantity === 0;
  }

  function toggleFavorite(id) {
    const favorites = readSavedArray(favoritesKey);
    const index = favorites.indexOf(id);
    if (index === -1) favorites.push(id);
    else favorites.splice(index, 1);
    saveArray(favoritesKey, favorites);
    return index === -1;
  }

  function addToCart(id) {
    if (!products.some(function (product) { return product.id === id; })) return false;
    const cart = readSavedArray(cartKey);
    const item = cart.find(function (entry) { return entry.id === id; });
    if (item && item.quantity >= 99) return false;
    if (item) item.quantity += 1;
    else cart.push({ id: id, quantity: 1 });
    if (!saveArray(cartKey, cart)) return false;
    window.dispatchEvent(new CustomEvent("tamyr:cart-updated"));
    return true;
  }

  searchInput.addEventListener("input", renderProducts);
  categorySelect.addEventListener("change", renderProducts);
  sortSelect.addEventListener("change", renderProducts);
  onlyFavorites.addEventListener("change", renderProducts);

  resetButton.addEventListener("click", function () {
    searchInput.value = "";
    categorySelect.value = "all";
    sortSelect.value = "default";
    onlyFavorites.checked = false;
    feedback.textContent = "Filters reset.";
    renderProducts();
  });

  document.querySelector(".catalog-content").addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action][data-id]");
    if (!button) return;
    const product = products.find(function (item) { return item.id === button.dataset.id; });
    if (!product) return;

    if (button.dataset.action === "favorite") {
      const wasAdded = toggleFavorite(product.id);
      feedback.textContent = product.name + (wasAdded ? " added to favorites." : " removed from favorites.");
      renderProducts();
    } else if (button.dataset.action === "cart") {
      const wasAdded = addToCart(product.id);
      feedback.textContent = wasAdded ? product.name + " added to your bag." :
        "Cannot add item (storage disabled or maximum quantity reached).";
      updateCartCounter();
    }
  });

  document.querySelectorAll('a[href="#women"], a[href="#men"]').forEach(function (link) {
    link.addEventListener("click", function () {
      categorySelect.value = "all";
      onlyFavorites.checked = false;
      searchInput.value = "";
      renderProducts();
    });
  });

  window.addEventListener("storage", function () { renderProducts(); });
  renderProducts();
});

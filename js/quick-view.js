document.addEventListener("DOMContentLoaded", function () {
    const products = window.TamyrProducts || [];
    const key = "tamyr-recently-viewed-v1";
    const dialog = document.getElementById("quick-view-dialog");
    const recentList = document.getElementById("recent-products");
    const empty = document.getElementById("recent-empty");
    const clearButton = document.getElementById("clear-recent");

    function readRecent() {
        try {
            const saved = JSON.parse(localStorage.getItem(key) || "[]");
            if (!Array.isArray(saved)) return [];
            return saved.filter(id => typeof id === "string" && products.some(p => p.id === id)).slice(0, 3);
        } catch (error) {
            return [];
        }
    }

    function renderRecent() {
        const ids = readRecent();
        recentList.replaceChildren();
        for (const id of ids) {
            const product = products.find(p => p.id === id);
            const button = document.createElement("button");
            button.type = "button";
            button.className = "final-product recent-product";
            button.dataset.id = id;
            const image = document.createElement("img");
            image.src = product.image;
            image.alt = "";
            const name = document.createElement("span");
            name.textContent = product.name;
            button.append(image, name);
            recentList.appendChild(button);
        }
        empty.hidden = ids.length > 0;
        clearButton.hidden = ids.length === 0;
    }

    function openQuickView(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;

        document.getElementById("quick-title").textContent = product.name;
        document.getElementById("quick-description").textContent = product.color + " · " + product.sizes;
        document.getElementById("quick-price").textContent = product.price.toLocaleString("en-US") + " tenge";
        const image = document.getElementById("quick-image");
        image.src = product.image;
        image.alt = product.name;
        dialog.showModal();

        const ids = readRecent().filter(savedId => savedId !== id);
        ids.unshift(id);
        try {
            localStorage.setItem(key, JSON.stringify(ids.slice(0, 3)));
        } catch (error) {
        }
        renderRecent();
    }

    document.querySelector(".catalog-content").addEventListener("click", function (event) {
        const button = event.target.closest('button[data-action="quick-view"]');
        if (button) openQuickView(button.dataset.id);
    });

    recentList.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-id]");
        if (button) openQuickView(button.dataset.id);
    });

    document.getElementById("quick-close").addEventListener("click", () => dialog.close());
    document.getElementById("quick-done").addEventListener("click", () => dialog.close());

    clearButton.addEventListener("click", function () {
        try {
            localStorage.removeItem(key);
            renderRecent();
        } catch (error) {
            empty.textContent = "Cannot clear history in this browser.";
            empty.hidden = false;
        }
    });

    renderRecent();
});

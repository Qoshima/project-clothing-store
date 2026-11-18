$(document).ready(function () {
    "use strict";

    const products = window.TamyrProducts || [];
    const looksKey = "tamyr-looks-v1";
    const ordersKey = "tamyr-orders-v1";
    const favoritesKey = "tamyr-favorites-v1";

    class Look {
        constructor(id, name, items) {
            this.id = id || Date.now().toString();
            this.name = name;
            this.items = items; 
        }

        static getAll() {
            try {
                const data = JSON.parse(localStorage.getItem(looksKey) || "[]");
                return Array.isArray(data) ? data : [];
            } catch (e) {
                return [];
            }
        }

        save() {
            const looks = Look.getAll();
            looks.push(this);
            localStorage.setItem(looksKey, JSON.stringify(looks));
        }

        static update(id, newName, newItems) {
            const looks = Look.getAll();
            const index = looks.findIndex(l => l.id === id);
            if (index !== -1) {
                looks[index].name = newName;
                looks[index].items = newItems;
                localStorage.setItem(looksKey, JSON.stringify(looks));
                return true;
            }
            return false;
        }

        static delete(id) {
            const looks = Look.getAll().filter(l => l.id !== id);
            localStorage.setItem(looksKey, JSON.stringify(looks));
        }
    }

    class Dashboard {
        constructor() {
            this.orders = this.readStorage(ordersKey);
            this.favorites = this.readStorage(favoritesKey);
        }

        readStorage(key) {
            try {
                const data = JSON.parse(localStorage.getItem(key) || "[]");
                return Array.isArray(data) ? data : [];
            } catch (e) {
                return [];
            }
        }

        getTotalOrders() {
            return this.orders.length;
        }

        getTotalSpent() {
            return this.orders.reduce((sum, order) => sum + (order.total || 0), 0);
        }

        getFavoritesCount() {
            return this.favorites.length;
        }

        getPopularCategory() {
            if (this.orders.length === 0) return "None yet";
            const categoryCounts = {};
            this.orders.forEach(order => {
                order.items.forEach(item => {
                    const product = products.find(p => p.name === item.name);
                    if (product) {
                        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + item.quantity;
                    }
                });
            });

            let popular = "None yet";
            let maxCount = 0;
            for (const cat in categoryCounts) {
                if (categoryCounts[cat] > maxCount) {
                    maxCount = categoryCounts[cat];
                    popular = cat === "women" ? "Women's" : "Men's";
                }
            }
            return popular;
        }
    }

    function renderDashboard() {
        const dashboard = new Dashboard();
        const grid = document.getElementById("dashboard-grid");
        if (!grid) return;

        const totalSpentFormat = new Intl.NumberFormat("en-US").format(dashboard.getTotalSpent());

        grid.innerHTML = `
            <div class="stat-card"><h3>Total Orders</h3><p>${dashboard.getTotalOrders()}</p></div>
            <div class="stat-card"><h3>Total Spent</h3><p>${totalSpentFormat} KZT</p></div>
            <div class="stat-card"><h3>Favorite Items</h3><p>${dashboard.getFavoritesCount()}</p></div>
            <div class="stat-card"><h3>Top Category</h3><p>${dashboard.getPopularCategory()}</p></div>
        `;
    }

    function renderLooks() {
        const looks = Look.getAll();
        const grid = document.getElementById("looks-grid");
        const emptyMsg = document.getElementById("looks-empty");
        
        if (!grid || !emptyMsg) return;

        if (looks.length === 0) {
            grid.innerHTML = "";
            emptyMsg.style.display = "block";
            return;
        }

        emptyMsg.style.display = "none";
        grid.innerHTML = "";

        looks.forEach(look => {
            const card = document.createElement("div");
            card.className = "look-card";

            let imagesHtml = "";
            look.items.forEach(id => {
                const prod = products.find(p => p.id === id);
                if (prod) imagesHtml += `<img src="${prod.image}" alt="${prod.name}">`;
            });

            card.innerHTML = `
                <h3>${look.name}</h3>
                <div class="look-items-preview">${imagesHtml}</div>
                <div class="look-actions">
                    <button class="btn-edit" data-id="${look.id}">Edit</button>
                    <button class="btn-delete" data-id="${look.id}">Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    const modal = document.getElementById("look-modal");
    const form = document.getElementById("look-form");
    const productSelection = document.getElementById("product-selection");

    function populateProductCheckboxes() {
        productSelection.innerHTML = "";
        products.forEach(p => {
            productSelection.innerHTML += `
                <label class="product-checkbox-label">
                    <input type="checkbox" value="${p.id}" class="look-product-cb">
                    <img src="${p.image}" alt="">
                    ${p.name}
                </label>
            `;
        });
    }

    function openModal(isEdit, lookData = null) {
        populateProductCheckboxes();
        form.reset();
        document.getElementById("look-name-error").textContent = "";
        document.getElementById("look-items-error").textContent = "";

        if (isEdit && lookData) {
            document.getElementById("modal-title").textContent = "Edit Look";
            document.getElementById("look-id").value = lookData.id;
            document.getElementById("look-name").value = lookData.name;
            document.querySelectorAll(".look-product-cb").forEach(cb => {
                if (lookData.items.includes(cb.value)) cb.checked = true;
            });
        } else {
            document.getElementById("modal-title").textContent = "Create New Look";
            document.getElementById("look-id").value = "";
        }
        modal.hidden = false;
    }

    function closeModal() {
        modal.hidden = true;
    }

    document.getElementById("create-look-btn").addEventListener("click", () => openModal(false));
    document.getElementById("cancel-look-btn").addEventListener("click", closeModal);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("look-id").value;
        const name = document.getElementById("look-name").value.trim();
        const selectedItems = Array.from(document.querySelectorAll(".look-product-cb:checked")).map(cb => cb.value);

        let isValid = true;
        if (name === "") {
            document.getElementById("look-name-error").textContent = "Please enter a look name.";
            isValid = false;
        }
        if (selectedItems.length === 0) {
            document.getElementById("look-items-error").textContent = "Please select at least one product.";
            isValid = false;
        }

        if (!isValid) return;

        if (id) {
            Look.update(id, name, selectedItems);
        } else {
            const newLook = new Look(null, name, selectedItems);
            newLook.save();
        }

        closeModal();
        renderLooks(); 
    });

    document.getElementById("looks-grid").addEventListener("click", function (e) {
        const target = e.target;
        const id = target.getAttribute("data-id");
        
        if (!id) return;

        if (target.classList.contains("btn-delete")) {
            if (confirm("Are you sure you want to delete this look?")) {
                Look.delete(id);
                renderLooks();
            }
        } else if (target.classList.contains("btn-edit")) {
            const look = Look.getAll().find(l => l.id === id);
            if (look) openModal(true, look);
        }
    });

    renderDashboard();
    renderLooks();
});
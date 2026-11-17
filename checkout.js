$(document).ready(function () {
    const cartKey = "tamyr-cart-v1";
    const ordersKey = "tamyr-orders-v1";
    const products = window.TamyrProducts || [];
    let step = 1;

    // OOP: each product in the cart becomes a CartItem object.
    class CartItem {
        constructor(product, quantity) {
            this.id = product.id;
            this.name = product.name;
            this.image = product.image;
            this.price = product.price;
            this.quantity = quantity;
        }

        getTotal() {
            return this.price * this.quantity;
        }
    }

    function readCart() {
        try {
            const data = JSON.parse(localStorage.getItem(cartKey) || "[]");
            if (!Array.isArray(data)) return [];
            return data.filter(item => item && typeof item.id === "string" &&
                Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99);
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(cartKey, JSON.stringify(cart));
            return true;
        } catch (error) {
            showError("The cart could not be saved in this browser.");
            return false;
        }
    }

    function getCartItems() {
        const items = [];
        for (const entry of readCart()) {
            const product = products.find(p => p.id === entry.id);
            if (product) items.push(new CartItem(product, entry.quantity));
        }
        return items;
    }

    function calculateTotals(items) {
        let subtotal = 0;
        for (const item of items) subtotal += item.getTotal();
        const shipping = subtotal === 0 || subtotal >= 670000 ? 0 : 5000;
        return { subtotal, shipping, total: subtotal + shipping };
    }

    function renderCart() {
        const $summary = $(".order-summary");
        const items = getCartItems();
        $summary.empty().append('<h2 id="order-title">Your order</h2>');

        if (items.length === 0) {
            $summary.append('<p class="order-demo">Your bag is empty. Add items from the catalog.</p>');
            return;
        }

        items.forEach(function (item) {
            const $row = $("<div>").addClass("order-item").attr("data-id", item.id);
            const $img = $("<img>").attr({ src: item.image, alt: item.name, width: 100, height: 130 });
            const $info = $("<div>").addClass("order-item-info");
            $info.append($("<h3>").text(item.name));
            $info.append($("<p>").addClass("order-item-price").text(item.price.toLocaleString() + " tenge"));
            const $controls = $("<div>").addClass("quantity-controls");
            $controls.append($("<button type='button'>−</button>").addClass("qty-minus").attr("data-id", item.id));
            $controls.append($("<span>").text(item.quantity));
            $controls.append($("<button type='button'>+</button>").addClass("qty-plus").attr("data-id", item.id));
            $controls.append($("<button type='button'>Remove</button>").addClass("remove-item").attr("data-id", item.id));
            $info.append($controls);
            $row.append($img, $info);
            $summary.append($row);
        });

        const totals = calculateTotals(items);
        const $totals = $("<dl>").addClass("order-totals");
        $totals.append("<div><dt>Subtotal</dt><dd>" + totals.subtotal.toLocaleString() + " tenge</dd></div>");
        $totals.append("<div><dt>Shipping</dt><dd>" + (totals.shipping === 0 ? "Free" : totals.shipping.toLocaleString() + " tenge") + "</dd></div>");
        $totals.append("<div class='order-total'><dt>Total</dt><dd>" + totals.total.toLocaleString() + " tenge</dd></div>");
        $summary.append($totals);
        if (step === 3) showReview();
    }

    $(".order-summary").on("click", ".qty-plus, .qty-minus, .remove-item", function () {
        const id = $(this).attr("data-id");
        const action = $(this).attr("class");
        const cart = readCart();
        const item = cart.find(entry => entry.id === id);
        if (!item) return;

        if (action === "qty-plus" && item.quantity < 99) item.quantity++;
        if (action === "qty-minus") item.quantity--;
        const updated = action === "remove-item" || item.quantity === 0
            ? cart.filter(entry => entry.id !== id) : cart;
        if (saveCart(updated)) renderCart();
    });

    function validatePhone(value) {
        if (value.trim() === "") return "Enter your phone number.";
        return value.replace(/\D/g, "").length < 10 ? "Enter at least 10 digits." : "";
    }

    function required(value, label) {
        return value.trim() === "" ? "Enter your " + label + "." : "";
    }

    function validateStep(number) {
        let checks;
        if (number === 1) {
            checks = [
                showFieldError("#email", validateEmail($("#email").val())),
                showFieldError("#phone", validatePhone($("#phone").val()))
            ];
        } else {
            checks = [
                showFieldError("#firstname", validateName($("#firstname").val())),
                showFieldError("#lastname", validateName($("#lastname").val())),
                showFieldError("#country", required($("#country").val(), "country")),
                showFieldError("#city", required($("#city").val(), "city")),
                showFieldError("#address", required($("#address").val(), "street address")),
                showFieldError("#postalcode", required($("#postalcode").val(), "postal code"))
            ];
        }
        return checks.every(Boolean);
    }

    function showError(message) {
        $("#checkout-message").stop(true, true).show().css("color", "#a12b2b").text(message);
    }

    function showStep() {
        $(".checkout-step").each(function () {
            this.hidden = Number(this.dataset.step) !== step;
        });
        const titles = ["Contact information", "Shipping details", "Review order"];
        $("#checkout-progress").text("Step " + step + " of 3 — " + titles[step - 1]);
        $("#step-back").prop("hidden", step === 1);
        $("#step-next").prop("hidden", step === 3);
        $("#checkout-submit").prop("hidden", step !== 3);
        if (step === 3) showReview();
    }

    function showReview() {
        const items = getCartItems();
        const totals = calculateTotals(items);
        $("#review-contact").text($("#email").val() + " | " + $("#phone").val());
        $("#review-shipping").text([
            $("#firstname").val(), $("#lastname").val(), $("#address").val(),
            $("#city").val(), $("#state").val(), $("#country").val(), $("#postalcode").val()
        ].filter(Boolean).join(", "));
        const $items = $("#review-items").empty();
        items.forEach(item => $items.append($("<li>").text(item.name + " × " + item.quantity)));
        $("#review-total").text("Total: " + totals.total.toLocaleString() + " tenge");
    }

    function nextStep() {
        hideSuccess("#checkout-message");
        if (!validateStep(step)) {
            focusFirstError(document.getElementById("checkout-form"));
            return;
        }
        if (step === 2 && getCartItems().length === 0) {
            showError("Add a product to your bag before continuing.");
            return;
        }
        step++;
        showStep();
    }

    function readOrders() {
        try {
            const data = JSON.parse(localStorage.getItem(ordersKey) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    $("#step-next").on("click", nextStep);
    $("#step-back").on("click", function () {
        if (step > 1) { step--; hideSuccess("#checkout-message"); showStep(); }
    });

    $("#checkout-form").on("submit", function (event) {
        event.preventDefault();
        if (step < 3) { nextStep(); return; }
        if (!validateStep(1)) { step = 1; showStep(); focusFirstError(this); return; }
        if (!validateStep(2)) { step = 2; showStep(); focusFirstError(this); return; }

        const items = getCartItems();
        if (items.length === 0) { showError("Your bag is empty."); return; }
        const order = {
            date: new Date().toLocaleString(),
            items: items.map(item => ({ name: item.name, quantity: item.quantity })),
            total: calculateTotals(items).total
        };

        try {
            const orders = readOrders();
            orders.unshift(order);
            localStorage.setItem(ordersKey, JSON.stringify(orders));
            localStorage.removeItem(cartKey);
        } catch (error) {
            showError("Could not save your demo order. Please try again.");
            return;
        }

        renderCart();
        this.reset();
        $("#checkout-form .field-error").remove();
        $("#checkout-form .input-error").removeClass("input-error").removeAttr("aria-invalid");
        step = 1;
        showStep();
        $("#checkout-message").css("color", "#48634f");
        showSuccess("#checkout-message", "Demo order saved! See Order History on the Account page.");
    });

    $("#checkout-form input").on("input", function () {
        hideSuccess("#checkout-message");
        const $field = $(this).closest(".checkout-field");
        $field.find(".field-error").remove();
        $(this).removeClass("input-error").removeAttr("aria-invalid");
    });

    showStep();
    renderCart();
});

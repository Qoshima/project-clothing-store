$(document).ready(function () {
    const cartKey = "tamyr-cart-v1";
    const products = window.TamyrProducts || [];

    function readCart() {
        return JSON.parse(localStorage.getItem(cartKey)) || [];
    }

    function saveCart(cart) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    function findProduct(id) {
        return products.find(function (p) { return p.id === id; });
    }


    function calculateTotals(cart) {
        let subtotal = 0;
        for (const item of cart) {
            const product = findProduct(item.id);
            if (product) subtotal += product.price * item.quantity;
        }
        const shipping = subtotal >= 670000 || subtotal === 0 ? 0 : 5000;
        return { subtotal, shipping, total: subtotal + shipping };
    }

    function renderCart() {
        const $summary = $(".order-summary");
        const cart = readCart();
        $summary.empty().append('<h2 id="order-title">Your order</h2>');

        if (cart.length === 0) {
            $summary.append('<p class="order-demo" style="color: #a12b2b;">Your bag is empty. Add items from the catalog.</p>');
            return;
        }

        cart.forEach(function (item) {
            const product = findProduct(item.id);
            if (!product) return;

            $summary.append(`
                <div class="order-item" data-id="${item.id}" style="margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid #D8D0C5;">
                    <img src="${product.image}" alt="${product.name}" width="80" height="100" style="object-fit:contain;">
                    <div class="order-item-info">
                        <h3>${product.name}</h3>
                        <p class="order-item-price">${product.price.toLocaleString()} tenge</p>
                        <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
                            <button class="qty-minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-plus" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `);
        });

        const totals = calculateTotals(cart);
        $summary.append(`
            <dl class="order-totals">
                <div><dt>Subtotal</dt><dd>${totals.subtotal.toLocaleString()} tenge</dd></div>
                <div><dt>Shipping</dt><dd>${totals.shipping === 0 ? "Free" : totals.shipping.toLocaleString() + " tenge"}</dd></div>
                <div class="order-total"><dt>Total</dt><dd>${totals.total.toLocaleString()} tenge</dd></div>
            </dl>
        `);
    }

    $(".order-summary").on("click", ".qty-plus", function () {
        const id = $(this).data("id");
        let cart = readCart();
        const item = cart.find(i => i.id === id);
        if (item) { item.quantity++; saveCart(cart); renderCart(); }
    });

    $(".order-summary").on("click", ".qty-minus", function () {
        const id = $(this).data("id");
        let cart = readCart();
        const item = cart.find(i => i.id === id);
        if (item && item.quantity > 1) { item.quantity--; saveCart(cart); renderCart(); }
        else if (item && item.quantity === 1) { removeItem(id); }
    });

    $(".order-summary").on("click", ".remove-item", function () {
        removeItem($(this).data("id"));
    });

    function removeItem(id) {
        $(`.order-item[data-id="${id}"]`).slideUp(200, function () {
            let cart = readCart().filter(i => i.id !== id);
            saveCart(cart);
            renderCart();
        });
    }

    function validatePhone(value) {
        const digits = value.replace(/\D/g, "");
        if (!value.trim()) return "Enter your phone number.";
        if (digits.length < 10) return "Enter at least 10 digits.";
        return "";
    }

    function validateRequired(value, field) {
        return value.trim() === "" ? "Enter your " + field + "." : "";
    }

    const checkoutForm = document.getElementById("checkout-form");

    if (checkoutForm) {
        $(checkoutForm).on("submit", function (event) {
            event.preventDefault();
            hideSuccess("#checkout-message");

            const nameValid = showFieldError("#firstname", validateName($("#firstname").val())) && 
                              showFieldError("#lastname", validateName($("#lastname").val()));
            const emailValid = showFieldError("#email", validateEmail($("#email").val()));
            const phoneValid = showFieldError("#phone", validatePhone($("#phone").val()));
            const countryValid = showFieldError("#country", validateRequired($("#country").val(), "country"));
            const cityValid = showFieldError("#city", validateRequired($("#city").val(), "city"));
            const addressValid = showFieldError("#address", validateRequired($("#address").val(), "street address"));
            const postalValid = showFieldError("#postalcode", validateRequired($("#postalcode").val(), "postal code"));

            if (!(nameValid && emailValid && phoneValid && countryValid && cityValid && addressValid && postalValid)) {
                focusFirstError(checkoutForm);
                return;
            }

            showSuccess("#checkout-message", "Demo order placed successfully! Thank you.");
            localStorage.removeItem(cartKey);
            renderCart();
            checkoutForm.reset();
            $(".checkout-field small.field-error").remove();
            $(".input-error").removeClass("input-error");
        });

        $("#checkout-form input").on("input", function () {
            hideSuccess("#checkout-message");
            if ($("#checkout-form").find(".field-error").length > 0) {
                const $input = $(this);
                $input.closest(".checkout-field").find("#" + $input.attr("id") + "-error").remove();
                $input.removeClass("input-error").removeAttr("aria-invalid");
            }
        });
    }

    renderCart();
});
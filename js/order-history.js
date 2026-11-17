document.addEventListener("DOMContentLoaded", function () {
    const key = "tamyr-orders-v1";
    const list = document.getElementById("orders-list");
    const empty = document.getElementById("orders-empty");
    const clear = document.getElementById("clear-orders");
    if (!list || !empty || !clear) return;

    function readOrders() {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");

            return Array.isArray(data) ? data.filter(order =>
                order &&
                typeof order.date === "string" &&
                Array.isArray(order.items) &&
                typeof order.total === "number" &&
                order.items.every(item =>
                    item &&
                    typeof item.name === "string" &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0
                )
            ) : [];

        } catch (error) {
            return [];
        }
    }

    function renderOrders() {
        const orders = readOrders();
        list.replaceChildren();

        orders.forEach(function (order) {
            const line = document.createElement("li");
            const names = order.items.map(item => item.name + " × " + item.quantity).join(", ");
            line.textContent = order.date + " — " + names + " — " +
                order.total.toLocaleString() + " tenge";
            list.appendChild(line);
        });

        empty.hidden = orders.length > 0;
        clear.hidden = orders.length === 0;
    }

    clear.addEventListener("click", function () {
        try {
            localStorage.removeItem(key);
            renderOrders();
        } catch (error) {
            empty.textContent = "Could not clear order history.";
            empty.hidden = false;
        }
    });

    renderOrders();
});

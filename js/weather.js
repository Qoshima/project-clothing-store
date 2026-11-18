document.addEventListener("DOMContentLoaded", function () {
    const products = window.TamyrProducts || [];
    const city = document.getElementById("weather-city");
    const button = document.getElementById("weather-button");
    const status = document.getElementById("weather-status");
    const results = document.getElementById("weather-results");

    // Choose existing products according to the real temperature
    function recommendProducts(temperature) {
        let ids;
        if (temperature < 5) {
            ids = ["women-03", "men-05", "women-06"];
        } else if (temperature < 18) {
            ids = ["women-02", "men-04", "men-02"];
        } else {
            ids = ["women-01", "women-04", "men-03"];
        }
        return products.filter(product => ids.includes(product.id));
    }

    function showRecommendations(items) {
        results.replaceChildren();
        for (const product of items) {
            const card = document.createElement("div");
            card.className = "final-product";
            const image = document.createElement("img");
            image.src = product.image;
            image.alt = product.name;
            image.loading = "lazy";
            const name = document.createElement("p");
            name.textContent = product.name;
            card.append(image, name);
            results.appendChild(card);
        }
    }

    async function checkWeather() {
        const [latitude, longitude] = city.value.split(",");
        const cityName = city.options[city.selectedIndex].text;
        const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude +
            "&longitude=" + longitude + "&current=temperature_2m&timezone=auto";

        button.disabled = true;
        status.textContent = "Loading weather...";
        results.replaceChildren();

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Weather request failed");
            const data = await response.json();
            const temperature = data.current?.temperature_2m;
            if (typeof temperature !== "number" || !Number.isFinite(temperature)) {
                status.textContent = "No weather data available for this city.";
                return;
            }

            const recommendations = recommendProducts(temperature);
            if (recommendations.length === 0) {
                status.textContent = "Weather in " + cityName + ": " + temperature + " °C. No matching products.";
                return;
            }
            status.textContent = "Weather in " + cityName + ": " + temperature + " °C. Our suggestions:";
            showRecommendations(recommendations);
        } catch (error) {
            status.textContent = "Could not load weather. Check your connection and try again.";
        } finally {
            button.disabled = false;
        }
    }

    button.addEventListener("click", checkWeather);
});
